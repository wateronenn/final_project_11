import { createItem, deleteItem, getItems,clearItems,generateItem } from "./api.js";

/** @typedef {import("./config.js").Item} Item */
/** @typedef {import("./config.js").ItemPayload} ItemPayload */

/**
 * @param {Item[]} items
 */

let items = [];
let currentIndex = 0;

function getRandomColor() {
  const colors = [
    "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", 
    "#BDB2FF", "#FFC6FF"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function darkenColor(hex, percent) {
  let num = parseInt(hex.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = (num >> 8 & 0x00FF) - amt,
      B = (num & 0x0000FF) - amt;

  return "#" + (
    0x1000000 +
    (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 +
    (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 +
    (B < 0 ? 0 : B > 255 ? 255 : B)
  ).toString(16).slice(1).toUpperCase();
}

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

  const baseColor = getRandomColor();
  const darkerColor = darkenColor(baseColor, 20); // 20% darker

  front.style.backgroundColor = baseColor;
  back.style.backgroundColor = darkerColor;

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
      currentIndex = (currentIndex +1) % items.length;
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
export function handleShuf() {
  if (items.length > 1) {
    flashcard.classList.remove("flipped");
    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * items.length);
      } while (randomIndex === currentIndex);
      currentIndex = randomIndex;
      renderFlashcard();
    }, 150);
  }

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


  generateBtn.disabled = true;
  generateBtn.textContent = "Downloading...";
  //console.log(levelgen.value);
  items=await generateItem(payload);
  await fetchAndDrawTable();

  generateBtn.disabled = false;
  generateBtn.textContent = "Generate ✨";

  levelgen.value = "";
  subjectgen.value = "";
  amountgen.value="";
  genprompt.value="";

  

}