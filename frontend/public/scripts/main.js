import { fetchAndDrawTable, handleCreateItem,handleClearItems } from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDrawTable();

  /** @type {HTMLButtonElement} */
  const addButton = document.getElementById("add-newrow");
  addButton.addEventListener("click", () => {
    handleCreateItem();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDrawTable();

  /** @type {HTMLButtonElement} */
  const clearButton = document.getElementById("clear-items");
  clearButton.addEventListener("click", () => {
    handleClearItems();
  });
});
