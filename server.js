import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ollama Backend Running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.time("ollama");

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          stream: false,
          messages: [
            {
              role: "system",
              content:
                "Answer briefly and professionally.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await ollamaResponse.json();

    console.timeEnd("ollama");

    res.json({
      reply: data.message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Sorry, I couldn't generate a response.",
    });
  }
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});