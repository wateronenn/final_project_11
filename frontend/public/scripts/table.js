import { createItem, deleteItem, getItems,clearItems,generateItem } from "./api.js";

/** @typedef {import("./config.js").Item} Item */
/** @typedef {import("./config.js").ItemPayload} ItemPayload */

/**
 * @param {Item[]} items
 */

let items = [];
let currentIndex = 0;

function renderFlashcard() {
  const flashcard = document.getElementById("flashcard");
  const front = document.getElementById("flashcard-front");
  const back = document.getElementById("flashcard-back");
  const counter = document.getElementById("cardCounter");

  if (items.length === 0) {
    front.innerText = "No cards available";
    back.innerText = "Please add one!";
    counter.innerText = "0 / 0";
    return;
  }

  const item = items[currentIndex];
  front.innerText = item.question;
  back.innerText = item.answer;
  counter.innerText = `${currentIndex + 1} / ${items.length}`;
}
/*
function drawTable(items) {
  /** @type {HTMLTableSectionElement} 
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
}*/

export async function fetchAndDrawTable() {
  items = await getItems();
  currentIndex = 0;
  renderFlashcard();
}

export function handleNext() {
  if (items.length > 0) {
    //console.log(currentIndex);
    document.getElementById("flashcard").classList.remove("flipped");
    setTimeout(() => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderFlashcard();
    }, 150);
  }
}
export function handlePrev() {
  if (items.length > 0) {
    document.getElementById("flashcard").classList.remove("flipped");
    setTimeout(() => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderFlashcard();
    }, 150);
  }
}
export function handleFlip() {
  document.getElementById("flashcard").classList.toggle("flipped");
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
  const questionToAdd = document.getElementById("frontInput");

  /** @type {HTMLInputElement} */
  const answerToAdd = document.getElementById("backInput");

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

export async function handleGenerateItems() {
  //console.log("test");
  /** @type {HTMLInputElement} */
  const levelgen = document.getElementById("educationLevel");

  /** @type {HTMLInputElement} */
  const subjectgen = document.getElementById("subject");

  /** @type {HTMLInputElement} */
  const amountgen = document.getElementById("cardCount");

  /** @type {HTMLInputElement} */
  const genprompt = document.getElementById("promptDetails");

  

  const payload = {
    level:levelgen.value, 
    subject:subjectgen.value,
    amount:amountgen.value,
    prompt:genprompt.value,
  };

  //console.log(levelgen.value);
  items=await generateItem(payload);
  await fetchAndDrawTable();

  levelgen.value = "";
  subjectgen.value = "";
  amountgen.value="";
  genprompt.value="";

}