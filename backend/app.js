import express from "express";
import cors from "cors";
import FlashcardRoute from "./route.js";

const app = express();
const PORT = 3222;
const BACKEND_URL = "http://localhost:3222"

app.use(cors());
app.use(express.json());

app.use("/api/flashcard",FlashcardRoute);



app.get("/",(req,res) => {
    res.send(`Backend is running at ${BACKEND_URL}`);
});


app.listen(PORT , () =>{
    console.log(`server running at ${BACKEND_URL}`);
})

export default app;