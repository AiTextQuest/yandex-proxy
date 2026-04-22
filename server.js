import express from 'express';
import cors from 'cors';

const app = express();

// Мощные CORS-заголовки (для теста разрешаем всё)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// ==========================================
// ВСТАВЬ СВОИ ЗНАЧЕНИЯ:
const FOLDER_ID = 'b1g9i925fihm3dpptcua';     // твой folder ID из Яндекс.Cloud
const API_KEY = 'b1g9i925fihm3dpptcua';      // твой API-ключ
// ==========================================

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
  res.send('YandexGPT Proxy работает! CORS настроен');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Прокси на порту ${PORT}`));
