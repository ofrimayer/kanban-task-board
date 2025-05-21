/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    //TODO
    this.moveButtons = [];
    this.cardIsMoving = null;
    this.whereToDrop();
    this.currPlaceholder = null; /* extra credit */

    // remove black border when clicking somewhere else
    document.addEventListener("click", (event) => {
      const droppedCards = document.querySelectorAll(".card.dropped");
      droppedCards.forEach((card) => {
        if (!card.contains(event.target)) {
          card.classList.remove("dropped");
        }
      });
    });
  }

  whereToDrop() {
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
      column.addEventListener("dragover", (event) => {
        event.preventDefault(); // makes dropping possible

        // *********** //
        /* extra credit */
        if (!this.currPlaceholder) {
          this.creatingPlaceholder(column);
        }
        column.classList.add("drag-over");
      });

      column.addEventListener("dragleave", () => {
        column.classList.remove("drag-over");
        if (this.currPlaceholder) {
          this.currPlaceholder.remove();
          this.currPlaceholder = null;
        }
      });
      // *********** //

      column.addEventListener("drop", (event) => {
        event.preventDefault();
        if (this.cardIsMoving) {
          column.appendChild(this.cardIsMoving); // appending to end
          this.cardIsMoving.classList.add("dropped"); /* extra credit */
          this.cardIsMoving.classList.remove("moving"); /* extra credit */
          this.stopMoving();
        }
      });
    });
  }

  /* extra credit */
  creatingPlaceholder(column) {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    column.appendChild(placeholder);
    this.currPlaceholder = placeholder;
  }

  startDragging(card) {
    this.cardIsMoving = card;
    card.classList.add("moving");
    setTimeout(() => {
      card.style.display = "none"; // collaps the space the card used to occupy
    }, 0);
  }

  // ****** original, working move here functionality ****** //
  startMoving(card) {
    //TODO
    this.stopMoving();
    this.cardIsMoving = card;
    card.classList.add("moving");

    const columns = document.querySelectorAll(".column");

    columns.forEach((col) => {
      const button = document.createElement("button");
      button.textContent = MOVE_HERE_TEXT;
      button.className = "moveHere";
      button.addEventListener("click", (event) => {
        this.moveToHere(event.currentTarget);
      });

      const columnTitle = col.querySelector(".columnTitle");
      if (columnTitle) {
        columnTitle.insertAdjacentElement("afterend", button);
      } else {
        col.insertBefore(button, col.firstChild);
      }

      this.moveButtons.push(button);

      const cards = col.querySelectorAll("article:not(.moving)");
      cards.forEach((cardElement) => {
        const btn = button.cloneNode(true);
        btn.addEventListener("click", (event) => {
          this.moveToHere(event.currentTarget);
        });
        cardElement.parentNode.insertBefore(btn, cardElement.nextSibling);
        this.moveButtons.push(btn);
      });
    });
  }

  stopMoving() {
    if (this.cardIsMoving) {
      this.cardIsMoving.classList.remove("moving");
      this.cardIsMoving.style.display = "block"; // making the card visible again
    }
    this.moveButtons.forEach((btn) => {
      btn.remove();
    });
    this.moveButtons = [];
    this.cardIsMoving = null;
    /* extra credit */
    if (this.currPlaceholder) {
      this.currPlaceholder.remove();
      this.currPlaceholder = null;
    }
  }

  // ****** original, working move here functionality ****** //
  moveToHere(button) {
    if (!this.cardIsMoving) return;
    button.parentNode.insertBefore(this.cardIsMoving, button.nextSibling);
    this.stopMoving();
  }
}
