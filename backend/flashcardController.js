

export const generatedFlashcard = async (req,res) =>{
    console.log("generated : ",req.body);
      const { level, subject, amount, prompt } = req.body;
      if (!level || !subject || !amount) {
        return res.status(400).json({ message: "Please enter all the information" });
      }
    
      const UserPrompt = `Generate ${amount} flashcards for a ${level} student on the subject "${subject}". ${prompt || ""}
    Return ONLY as JSON array: [{"question": "...", "answer":"..."}]. No other words included.`;
    
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: UserPrompt })
        });
    
        const data = await response.json();
    
        const textOutput = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text || data?.error || "";
    
        let generatedFlashcard;
        try {
          generatedFlashcard = JSON.parse(textOutput);
        } catch (e) {
          return res.status(500).json({ message: "Failed to parse model output", raw: textOutput });
        }
    
        const saved = generatedFlashcard.map(f => addFlashcard(f));
    
        return res.json(saved);
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating flashcards", error: err.message });
      }

};