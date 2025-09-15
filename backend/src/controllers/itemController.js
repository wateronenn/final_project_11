import Item from "../models/itemModel.js";
import dotenv from "dotenv";

dotenv.config();


/** @type {import("express").RequestHandler} */
export const createItem = async (req, res) => {
  //console.log(req.body);
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

/** @type {import("express").RequestHandler} */
export const getItems = async (req, res) => {
  const items = await Item.find();

  res.status(200).json(items);
};

/** @type {import("express").RequestHandler} */
export const deleteItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndDelete(req.params.id, req.body);
    console.log("deleted");
    if (updated) {
      res.status(200).json({ message: "OK" });
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

/** @type {import("express").RequestHandler} */
export const generateItem = async (req, res) => {
  try {
    const { level, subject, amount, prompt } = req.body;
    console.log("Request body:", req.body);
    if (!level || !subject || !amount)
      return res.status(400).json({ message: "Missing Data, Please fill out." });

    const userprompt = `Generate ${amount} flashcards for a ${level} student on the subject "${subject}". ${prompt || ""}.
    Return ONLY as JSON array: [{ "question": "...", "answer": "..." }] , NO OTHER WORDS INCLUDE`;

    const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama2:7b", prompt: userprompt }),
    });
    console.log(response);
    const text = await response.text();
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // Combine all "response" chunks into a single string
    let fullContent = "";
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        fullContent += parsed.response;
      } catch (err) {
        console.warn("Skipping invalid JSON line:", line);
      }
    }

    // Now extract JSON array
    const startIndex = fullContent.indexOf("[");
    const endIndex = fullContent.lastIndexOf("]");
    if (startIndex === -1 || endIndex === -1) {
      return res.status(500).json({ message: "Invalid JSON output", raw: fullContent });
    }

    const jsonString = fullContent.slice(startIndex, endIndex + 1);

    let flashcards;
    try {
      flashcards = JSON.parse(jsonString);
    } catch (err) {
      return res.status(500).json({ message: "Failed to parse Ollama output", raw: fullContent });
    }

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(500).json({ message: "No flashcards generated", raw: fullContent });
    }

    // Save to DB
    const saved = await Item.insertMany(
      flashcards.map((fc) => ({ question: fc.question, answer: fc.answer }))
    );

    res.status(200).json({ message: "Flashcards generated successfully", items: saved });
  } catch (err) {
    console.error("Error in generateItem:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};
