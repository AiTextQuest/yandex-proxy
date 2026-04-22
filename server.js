import express from 'express';
import cors from 'cors';

const app = express();

// Настройка CORS — разрешаем запросы с любого домена
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==========================================
// ВСТАВЬ СВОИ ЗНАЧЕНИЯ:
const FOLDER_ID = 'b1g9i925fihm3dpptcua';     // твой folder ID из Яндекс.Cloud
const API_KEY = 'AQVNzdc2nFo6euhGYkqoPz8XvR0XmerRbsfGw4_j';      // твой API-ключ
// ==========================================

// Обработка preflight-запросов (OPTIONS)
app.options('/api/gpt', cors());

app.post('/api/gpt', async (req, res) => {
    console.log('Получен запрос:', req.body);
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
        console.log('Ответ YandexGPT:', data);
        
        // Добавляем CORS заголовки в ответ
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.json(data);
    } catch(e) {
        console.error('Ошибка:', e.message);
        res.status(500).json({ error: e.message });
    }
});

app.get('/', (req, res) => {
    res.send('YandexGPT Proxy работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Прокси на порту ${PORT}`));import express from 'express';
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
