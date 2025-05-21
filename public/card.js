// /* The text to use when description is empty */
// const NO_DESCRIPTION_TEXT = "(No description)";

// export default class Card {
//   // description: creates a new card with the given title and color.
//   // hint: this is a good place to create the HTML elements for the card and set up your handlers.
//   constructor(title, color, mover, id = null) {
//     const template = document.querySelector(".template.card").cloneNode(true);
//     template.classList.remove("template");

//     template.querySelector(".title").textContent = title;
//     template.style.backgroundColor = color;

//     // task 5
//     this.id = id || this.generateId(); // a unique ID to a card
//     template.dataset.id = this.id;

//     // a card's description should initially be empty (it should show "(No description)".
//     template.querySelector(".description").textContent = NO_DESCRIPTION_TEXT;

//     template.setAttribute("draggable", true);
//     template.addEventListener("dragstart", (event) => {
//       event.dataTransfer.setData("text/plain", null);
//       mover.startDragging(this.element);
//     });

//     /* extra credit */
//     template.addEventListener("dragend", () => {
//       if (this.element.classList.contains("moving")) {
//         this.element.classList.remove("moving");
//         this.element.classList.add("dropped");
//       }
//     });

//     // delete: click on the delete button for a card removes it from the board
//     template.querySelector(".delete").addEventListener("click", () => {
//       template.remove();
//       mover.stopMoving();
//     });

//     this.mover = mover;
//     this.element = template;

//     const moveButton = template.querySelector(".startMove");

//     moveButton.addEventListener("click", () => {
//       mover.startMoving(this.element);
//     });

//     // edit: opon click, hide the current description and show the <textarea> to let user enter a new description.
//     const editButton = template.querySelector(".edit");
//     const desc = template.querySelector(".description");
//     const editTxt = template.querySelector(".editDescription");
//     editButton.addEventListener("click", () => {
//       desc.classList.add("hidden");
//       editTxt.classList.remove("hidden");

//       // it should be focused with all text selected at the start:
//       editTxt.focus();
//       editTxt.select();
//     });

//     // saving the new description once user clicks or tabs away from the text box
//     editTxt.addEventListener("blur", () => {
//       desc.textContent = editTxt.value || NO_DESCRIPTION_TEXT;
//       desc.classList.remove("hidden");
//       editTxt.classList.add("hidden");
//     });
//   }

//   // description: adds the card to the board as the last (bottommost) card of the specified column.
//   // input: colElem is the DOM element for the column (e.g. the <section> element).
//   // note: for now, you can ignore the mover argument (pass null when calling it).
//   addToCol(colElem) {
//     colElem.appendChild(this.element);
//   }

//   // description: sets the description for the card to the text you passed in.
//   // ------------ if the description would ever be empty, the description should read "(No description)".
//   // note: we have defined a constant called NO_DESCRIPTION_TEXT in card.js.
//   setDescription(text) {
//     this.element.querySelector(".description").textContent = text || NO_DESCRIPTION_TEXT;
//   }

//   generateId() {
//     return "card-" + crypto.randomUUID(); // generate random number
//   }
// }

/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color, mover, id = null) {
    const template = document.querySelector(".template.card").cloneNode(true);
    template.classList.remove("template");

    template.querySelector(".title").textContent = title;
    template.style.backgroundColor = color;

    this.id = id || this.generateId();
    template.dataset.id = this.id;

    template.querySelector(".description").textContent = NO_DESCRIPTION_TEXT;

    template.setAttribute("draggable", true);
    template.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", null);
      mover.startDragging(this.element);
    });

    template.addEventListener("dragend", () => {
      if (this.element.classList.contains("moving")) {
        this.element.classList.remove("moving");
        this.element.classList.add("dropped");
      }
    });

    template.querySelector(".delete").addEventListener("click", () => {
      template.remove();
      mover.stopMoving();
    });

    this.mover = mover;
    this.element = template;

    const moveButton = template.querySelector(".startMove");

    moveButton.addEventListener("click", () => {
      mover.startMoving(this.element);
    });

    const editButton = template.querySelector(".edit");
    const desc = template.querySelector(".description");
    const editTxt = template.querySelector(".editDescription");
    editButton.addEventListener("click", () => {
      desc.classList.add("hidden");
      editTxt.classList.remove("hidden");

      editTxt.focus();
      editTxt.select();
    });

    editTxt.addEventListener("blur", () => {
      desc.textContent = editTxt.value || NO_DESCRIPTION_TEXT;
      desc.classList.remove("hidden");
      editTxt.classList.add("hidden");
    });
  }

  addToCol(colElem) {
    colElem.appendChild(this.element);
  }

  setDescription(text) {
    this.element.querySelector(".description").textContent = text || NO_DESCRIPTION_TEXT;
  }

  generateId() {
    return "card-" + crypto.randomUUID();
  }
}
