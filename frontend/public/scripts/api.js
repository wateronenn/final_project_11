import { BACKEND_URL } from "./config.js";

/** @typedef {import("./config.js").Item} Item */
/** @typedef {import("./config.js").ItemPayload} ItemPayload */

export async function getItems() {
  /** @type {Item[]} */
  const items = await fetch(`${BACKEND_URL}/items`).then((r) => r.json());

  return items;
}

/**
 * @param {ItemPayload} item
 */
export async function createItem(item) {
  await fetch(`${BACKEND_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

/**
 * @param {string} id
 */
export async function deleteItem(id) {
  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "DELETE",
  });
}


export async function generateItem(level,subject,amount,prompt){
  const obj = {level:level, subject:subject,amount:amount,prompt:prompt};

  const items = await fetch(`${BACKEND_URL}/items/generate`,{
    method:"POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(obj),
  }).then(res => res.json());

  return items;

}

export async function clearItems(items) {
  for (const item of items) {
    await fetch(`${BACKEND_URL}/items/${item._id}`, {
    method: "DELETE",
    }); 
  }
}