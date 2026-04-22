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
const API_KEY = 'AQVNzdc2nFo6euhGYkqoPz8XvR0XmerRbsfGw4_j';      // твой API-ключ
// ==========================================

app.post('/api/gpt', async (req, res) => {
  // Разрешаем CORS
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const messages = req.body.messages;
    console.log('📩 Запрос получен, сообщений:', messages.length);
    
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
    console.log('📦 Ответ от YandexGPT:', JSON.stringify(data, null, 2));
    
    // Возвращаем полный ответ, а не только result
    res.json(data);
  } catch(e) {
    console.error('❌ Ошибка:', e);
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

app.get('/', (req, res) => {
  res.send('YandexGPT Proxy работает! CORS настроен');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Прокси на порту ${PORT}`));
