import Item from "./item.js";

let flashcard = [];

export const getAllFlashcards = () => flashcard;
export const getFlashcardsById = (id) => flashcard.find(f => f.id === id);
export const addFlashcard = (data) => {
    const newItem = newItem(data.question,data.answer);
    flashcard.push(newItem);
    return newItem;
};

export const updateFlashcard = (id,data) => {
    const f = getFlashcardsById(id);
    if(!f) return null; // can't find
    f.question = data.question || f.question;
    f.answer = data.answer || f.answer;

    return f;

};

export const deleteFlashcard = (id) => {
    flashcard = flashcard.filter(f => f.id==id);
};
