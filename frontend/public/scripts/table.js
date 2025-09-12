import { createItem, deleteItem, getItems,clearItems } from "./api.js";

/** @typedef {import("./config.js").Item} Item */
/** @typedef {import("./config.js").ItemPayload} ItemPayload */

/**
 * @param {Item[]} items
 */
function drawTable(items) {
  /** @type {HTMLTableSectionElement} */
  const table = document.getElementById("main-table-body");

  // Clear all elements
  table.innerHTML = "";

  for (const item of items) {
    const row = table.insertRow();

    // put question + answer into the same cell
    const qaCell = row.insertCell();
    qaCell.innerText = `${item.question}\n${item.answer}`;
    qaCell.style.whiteSpace = "pre-line";

    const button = document.createElement("button");
    button.addEventListener("click", () => handleDelete(item._id));
    button.innerText = "ลบ";

    row.insertCell().appendChild(button);
  }
}

export async function fetchAndDrawTable() {
  const items = await getItems();
  drawTable(items);
}

/**
 * @param {string} id
 */
export async function handleDelete(id) {
  await deleteItem(id);
  await fetchAndDrawTable();
}

export async function handleCreateItem() {
  /** @type {HTMLInputElement} */
  const questionToAdd = document.getElementById("question-to-add");

  /** @type {HTMLInputElement} */
  const answerToAdd = document.getElementById("answer-to-add");

  const payload = {
    question: questionToAdd.value,
    answer: answerToAdd.value,
  };

  await createItem(payload);
  await fetchAndDrawTable();

  questionToAdd.value = "";
  answerToAdd.value = "";
}

export async function handleClearItems() {
  const items = await getItems();
  await clearItems(items);
  await fetchAndDrawTable();

}