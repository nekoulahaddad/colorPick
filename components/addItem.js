"use strict";

(function () {
  class AddItem extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const AddItemContainer = document.createElement("div");

      AddItemContainer.innerHTML = `
        <style>
          :host{
            font-size: 2vh;
          }
        .container{
          display:flex;
          justify-content:center;
          flex-direction: column;
        }
        .container>h3{
          text-align:center;
          color:#ffffff;
          font-weight:bold;
        }
        .addItemButton{
          font-size: 2vh;
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
          background-color:#53CBF1;
        }
        .button_container{
          width:100%;
          display:flex;
          justify-content:center;
        }
        .input_field{
          display:flex;
          justify-content:center;
          align-items:center;
          margin-bottom:1em;
          color:#A0A0A0;
        }
        .input{
          color:#A0A0A0;
          font-size: 2vh;
          background-color:#424242;
          outline: none;
          border:none;
          margin-left:1em;
          height:8vh; 
          width:30vh;
          border-radius:10px;
        }
        .input::placeholder {
          color: #A0A0A0;
          padding-left:0.2em;
        }
        .type-input{
          margin-left:1.9em;
        }
        .select * {
          height:8vh; 
        }
        </style>
        <div class="container">
          <h3>Добавление цвета</h3>
          <div class="input_field"><label>Название цвета</label><input placeholder="Введите название" class="input name-input" type="text"></input></div>
          <div class="input_field"><label>Выберите тип</label>
          <select class="input select type-input">    
          <option value="main">Main</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="base">Base</option>
          </select></div>
          <div class="input_field"><slot class="color-picker" name="color-picker" /></div>
          <div class="input_field"><slot class="color-picker-view color-input" name="color-picker-view" /></div>
          <div class="button_container">
            <button class="editable-list-add-item addItemButton">Добавить</button>
          </div>
        </div>
      `;

      this.addListItem = this.addListItem.bind(this);
      shadow.appendChild(AddItemContainer);
    }

    addListItem(e) {
      const textInput = this.shadowRoot.querySelector(".name-input");
      const typeInput = this.shadowRoot.querySelector(".type-input");
      const colorInput = window.localStorage.getItem("choosenColor");
      if (textInput.value) {
        function ID() {
          return "_" + Math.random().toString(36).substr(2, 9);
        }
        const data = JSON.parse(window.localStorage.getItem("colors"));
        data.push({
          id: ID(),
          name: textInput.value,
          type: typeInput.value,
          color: colorInput,
        });
        window.localStorage.setItem("colors", JSON.stringify(data));
        textInput.value = "";
        window.location.href = "../index.html";
      }
    }

    connectedCallback() {
      const addElementButton = this.shadowRoot.querySelector(
        ".editable-list-add-item"
      );
      addElementButton.addEventListener("click", this.addListItem, false);
    }
  }

  // let the browser know about the custom element
  customElements.define("add-item", AddItem);
})();
