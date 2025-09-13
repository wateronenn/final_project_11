import { fetchAndDrawTable, handleCreateItem, handleClearItems ,handleGenerateItems,handleNext,handlePrev,handleShuf} from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
  //console.log(5555555555555555);
  fetchAndDrawTable();
  

  const addButton = document.getElementById("add-newrow");
  const clearButton = document.getElementById("clear-items");
  const generateBtn = document.getElementById("generateBtn");
  const flashcard = document.getElementById("flashcard");

  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
  });
  
  if (addButton) {
    addButton.addEventListener("click", handleCreateItem);
  }

  if (clearButton) {
    clearButton.addEventListener("click", handleClearItems);
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", handleGenerateItems);
  }/*
  if (nextBtn) {
    generateBtn.addEventListener("click", handleNext);
  }*/
  document.getElementById("nextBtn").addEventListener("click", handleNext);
  document.getElementById("prevBtn").addEventListener("click", handlePrev);
  document.getElementById("ShuffleBtn").addEventListener("click", handleShuf);
  //console.log(11111111);
});
