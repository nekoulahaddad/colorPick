"use strict";

(function () {
  class ColorPicker extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const ColorPickerContainer = document.createElement("div");
      let colorsData =
        window.localStorage.getItem("colors") &&
        JSON.parse(window.localStorage.getItem("colors"));
      const headers = ["Цвет", "Название", "Тип", "Код", "Изменить", "Удалить"];

      ColorPickerContainer.innerHTML = `
        <style>
          :host{
            font-size: 2.5vh;
          }
          table{
                border-collapse: collapse;
                border-spacing: 0;
                width: 100%;
                border: 1px solid #313131;
          }
          th {
              padding: 1em;
              border: 1px solid #313131;
              color:#BFBFBF;
              background-color:#424242;
              font-weight: normal;
          }
        button {
          background: none;
          color: inherit;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          outline: inherit;
        }
        .button_container{
          width:100%;
          display:flex;
          justify-content:center;
        }
        .page-title{
          padding-top:30px;
          padding-bottom:10px;
          color:#ffffff;
          text-align:center;
        }
        .edit{
          stroke:#BFBFBF;
        }
        .edit:hover{
          stroke:#53CBF1;
        }
        .trash:hover{
          stroke:#CA4C4C;
        }
        .draggable {
            cursor: move;
            user-select: none;
        }
        .addItemButton{
          color:#ffffff;
          margin:20px;
          border: 1px solid #53CBF1;
          width:50vw;
          height: 6vh;
          border-radius:20px;
          text-decoration: none;
          display: inline-flex;
          align-items: center; 
          justify-content:center;
        }
        .table_labels{
          color:#ffffff;
          font-weight:bold;
        }
        .color_box{
          pointer-events: none;
          margin:auto;
          width: 10vh;
          height: 10vh;
        }
        </style>
        <h3 class="page-title">Таблица цветов</h3>
        <div style="overflow-x:auto;">
        <table id="table" class="table item-list">
          <tr>
          ${headers
            .map((header) => `<th class="table_labels">${header}</th>`)
            .join("")}
          </tr>
          ${colorsData
            ?.map(
              (item) => `
            <tr>
              <th><div class="color_box" style=background-color:${item.color}></div></th>
              <th>${item.name}</th>
              <th>${item.type}</th>
              <th>${item.color}</th>
              <th><button id=_${item.id} class="color-picker-edit-item"><svg class="edit" width="20" height="20" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.7402 1.80782C21.0858 1.47245 21.4962 1.20642 21.9478 1.02492C22.3994 0.843415 22.8834 0.75 23.3722 0.75C23.8612 0.75 24.3452 0.843415 24.7968 1.02492C25.2484 1.20642 25.6586 1.47245 26.0044 1.80782C26.35 2.14319 26.6242 2.54134 26.8112 2.97952C26.9982 3.4177 27.0946 3.88735 27.0946 4.36163C27.0946 4.83592 26.9982 5.30555 26.8112 5.74373C26.6242 6.18191 26.35 6.58006 26.0044 6.91543L8.2381 24.1536L1 26.069L2.97402 19.0461L20.7402 1.80782Z" 
 stroke-linecap="round" stroke-linejoin="round"/>
</svg></button></th>
              <th><button id=${item.id} class="color-picker-remove-item icon">
<svg class="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path  fill-rule="evenodd" clip-rule="evenodd" d="M15 4H4L5.26923 16H13.7308L15 4ZM13.8887 5H5.11135L6.16904 15H12.831L13.8887 5Z" fill="#BFBFBF
"/>
</svg>
              </button></th>
            </tr>
          `
            )
            .join("")}
        </table>
        </div>
        <div class="button_container">
          <a href="pages/add-item.html" class="color-picker-add-item addItemButton">Добавить цвет</a>
        </div>
      `;

      this.handleItemListeners = this.handleItemListeners.bind(this);
      this.removeListItem = this.removeListItem.bind(this);
      this.dragAndDrop = this.dragAndDrop.bind(this);
      shadow.appendChild(ColorPickerContainer);
    }

    connectedCallback() {
      this.dragAndDrop();
      const removeElementButtons = [
        ...this.shadowRoot.querySelectorAll(".color-picker-remove-item"),
      ];
      const editElementButtons = [
        ...this.shadowRoot.querySelectorAll(".color-picker-edit-item"),
      ];
      this.handleItemListeners(removeElementButtons, editElementButtons);
    }

    handleItemListeners(arrayOfRemoveElements, arrayOfEditElements) {
      arrayOfRemoveElements.forEach((element) => {
        element.addEventListener("click", this.removeListItem, false);
      });
      arrayOfEditElements.forEach((element) => {
        element.addEventListener("click", this.editListItem, false);
      });
    }

    editListItem(e) {
      let selectedColorForEditing = e.currentTarget.id.slice(1);
      window.localStorage.setItem("edit", selectedColorForEditing);
      window.location.href = "pages/edit-item.html";
    }

    removeListItem(e) {
      e.currentTarget.parentNode.parentNode.remove();
      const data = JSON.parse(window.localStorage.getItem("colors"));
      const newData = data.filter(
        (element) => element.id !== e.currentTarget.id
      );
      window.localStorage.setItem("colors", JSON.stringify(newData));
    }

    dragAndDrop() {
      const table = this.shadowRoot.getElementById("table");
      let draggingEle;
      let draggingRowIndex;
      let placeholder;
      let list;
      let isDraggingStarted = false;

      let x = 0;
      let y = 0;

      const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA =
          nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
        nodeB.parentNode.insertBefore(nodeA, nodeB);
        parentA.insertBefore(nodeB, siblingA);
      };

      const isAbove = function (nodeA, nodeB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
      };

      const cloneTable = function () {
        const rect = table.getBoundingClientRect();
        const width = parseInt(window.getComputedStyle(table).width);
        list = document.createElement("div");
        list.classList.add("clone-list");
        list.style.position = "absolute";
        list.style.left = `${rect.left}px`;
        list.style.top = `${rect.top}px`;
        table.parentNode.insertBefore(list, table);

        table.style.visibility = "hidden";

        table.querySelectorAll("tr").forEach(function (row) {
          const item = document.createElement("div");
          item.classList.add("draggable");

          const newTable = document.createElement("table");
          newTable.setAttribute("class", "clone-table");
          newTable.style.width = `${width}px`;

          const newRow = document.createElement("tr");
          const cells = [].slice.call(row.children);
          cells.forEach(function (cell) {
            const newCell = cell.cloneNode(true);
            newCell.style.width = `${parseInt(
              window.getComputedStyle(cell).width
            )}px`;
            newRow.appendChild(newCell);
          });

          newTable.appendChild(newRow);
          item.appendChild(newTable);
          list.appendChild(item);
        });
      };

      const mouseDownHandler = function (e) {
        // Get the original row
        const originalRow = e.target.parentNode;
        draggingRowIndex = [].slice
          .call(table.querySelectorAll("tr"))
          .indexOf(originalRow);

        // Determine the mouse position
        x = e.clientX;
        y = e.clientY;

        // Attach the listeners to `document`
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
      };

      const mouseMoveHandler = function (e) {
        if (!isDraggingStarted) {
          isDraggingStarted = true;
          cloneTable();
          draggingEle = [].slice.call(list.children)[draggingRowIndex];
          draggingEle.classList.add("dragging");
          placeholder = document.createElement("div");
          placeholder.classList.add("placeholder");
          draggingEle.parentNode.insertBefore(
            placeholder,
            draggingEle.nextSibling
          );
          placeholder.style.height = `${draggingEle.offsetHeight}px`;
        }
        draggingEle.style.position = "absolute";
        draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
        draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;
        x = e.clientX;
        y = e.clientY;
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;
        if (
          prevEle &&
          prevEle.previousElementSibling &&
          isAbove(draggingEle, prevEle)
        ) {
          swap(placeholder, draggingEle);
          swap(placeholder, prevEle);
          return;
        }
        if (nextEle && isAbove(nextEle, draggingEle)) {
          swap(nextEle, placeholder);
          swap(nextEle, draggingEle);
        }
      };

      const mouseUpHandler = function () {
        placeholder && placeholder.parentNode.removeChild(placeholder);
        draggingEle.classList.remove("dragging");
        draggingEle.style.removeProperty("top");
        draggingEle.style.removeProperty("left");
        draggingEle.style.removeProperty("position");
        const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);
        isDraggingStarted = false;
        list.parentNode.removeChild(list);
        let rows = [].slice.call(table.querySelectorAll("tr"));
        draggingRowIndex > endRowIndex
          ? rows[endRowIndex].parentNode.insertBefore(
              rows[draggingRowIndex],
              rows[endRowIndex]
            )
          : rows[endRowIndex].parentNode.insertBefore(
              rows[draggingRowIndex],
              rows[endRowIndex].nextSibling
            );
        table.style.removeProperty("visibility");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      table?.querySelectorAll("tr").forEach(function (row, index) {
        if (index === 0) {
          return;
        }
        const firstCell = row.firstElementChild;
        firstCell.classList.add("draggable");
        firstCell.addEventListener("mousedown", mouseDownHandler);
      });
    }
  }

  customElements.define("color-picker", ColorPicker);
})();
