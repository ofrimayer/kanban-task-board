import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    this.mover = new Mover();

    const form = document.querySelector("#addCard");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = document.querySelector("#cardTitle").value;
      const color = document.querySelector("#cardColor").value;
      this.addCard("todo", title, color);
      document.querySelector("#cardTitle").value = "";
      document.querySelector("#cardColor").value = "";
    });

    this.loadingBoard();
  }

  addCard(col, title, color, description = "", id = null) {
    const colElem = document.querySelector(`#${col}`);
    const newCard = new Card(title, color, this.mover, id);
    newCard.addToCol(colElem);
    newCard.setDescription(description);
    this.mover.stopMoving();
    return newCard;
  }

  // changed this to not use localStorage
  savingBoard() {
    const boardState = [];
    document.querySelectorAll(".column").forEach((column) => {
      const colId = column.id;
      column.querySelectorAll(".card").forEach((card) => {
        const title = card.querySelector(".title").textContent;
        const color = card.style.backgroundColor;
        const description = card.querySelector(".description").textContent;
        const id = card.dataset.id;
        boardState.push({ colId, title, color, description, id }); // adding the card data to the board state
      });
    });

    fetch('/saveBoard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(boardState)
    }).catch(err => console.error('Error saving board state:', err));
  }

  loadingBoard() {
    fetch('/loadBoard')
      .then(response => response.json())
      .then(boardState => {
        document.querySelectorAll(".column .card").forEach((card) => card.remove()); // removing existing cards to avoid duplicating
        boardState.forEach(({ colId, title, color, description, id }) => {
          this.addCard(colId, title, color, description, id);
        });
      })
      .catch(err => console.error('Error loading board state:', err));
  }
}

