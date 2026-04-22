import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FOLDER_ID = 'твой-folder-id';     // ЗАМЕНИ на свой
const API_KEY = 'AQVN...твой-ключ';     // ЗАМЕНИ на свой

app.post('/api/gpt', async (req, res) => {
  try {
    const messages = req.body.messages;
    
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Authorization": `Api-Key ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        modelUri: `gpt://${FOLDER_ID}/yandexgpt-lite`,
        completionOptions: { stream: false, temperature: 0.85, maxTokens: 500 },
        messages: messages
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send('YandexGPT Proxy работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Прокси на порту ${PORT}`));