const express = require("express");
const https = require("https");
const axios = require("axios");

const app = express();
const PORT = 3000;
const BOT_TOKEN = "7913359213:AAH-nzNQY4bKL4nEd9iLCVaaadmEcSfwyrs";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

let lastUpdateId = 0; // last msg id

app.use(express.json()); // парсинг

async function sendMessage(chatId, text) {
  try {
    const response = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error.message);
    return null;
  }
}

// Long Poll
async function getUpdates() {
  try {
    const response = await axios.get(`${API_URL}/getUpdates`, {
      params: {
        offset: lastUpdateId + 1, // получаем только новые сообщения
        timeout: 30,
        allowed_updates: ["message"],
      },
    });

    if (response.data.ok && response.data.result.length > 0) {
      for (const update of response.data.result) {
        lastUpdateId = update.update_id;

        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
          await sendMessage(chatId, `echo: ${text}`);
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при получении обновлений:", error.message);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } finally {
    setImmediate(getUpdates);
  }
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "running",
    bot: "echo-bot",
    lastUpdateId,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  getUpdates().then(() => console.log("Long Poll запущен"));
});
