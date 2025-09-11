import express from "express";
import fetch from "node-fetch";
import { addFlashcard, getAllFlashcards } from "./model.js";
import dotenv from "dotenv";
import * as flashcardController from "./flashcardController.js";

dotenv.config();

const router = express.Router();

// Hugging Face generate
router.get();
router.post("/generate" ,flashcardController.generatedFlashcard);


export default router;
