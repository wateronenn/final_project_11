/**
 * @typedef {Object} Item
 * @property {string} _id
 * @property {string} question
 * @property {string} answer
 */

/** @typedef {Omit<Item, "_id">} ItemPayload */

export const BACKEND_URL = "http://local:3222";

