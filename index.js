const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// VK токен (лучше потом перенести в ENV)
const VK_TOKEN = "vk1.a.5n4ah8tnPzX5XncHNAICL5plIHgbErbJdwEd2efaGkn8jwtIM3Y43THqJxxyqKHjXtEvTq-wSoLrzAJYgWlgPYGtbnvkHbG4-_icoNiuyY5Pa-ip6tTipTk8abjSaAYqDyy0yl7gB-vmDhzD2Eobx_spv7drMSeQNet7Ff5TcNCte7E5ZaXtQpgi0XB1cWywo5Eq49qw3KgmMk3XLiprMA";
const BOTPRESS_WEBHOOK = "https://webhook.botpress.cloud/f00e4def-bbef-4512-8a41-0dee5148f1ad";
// подтверждение сервера VK
const CONFIRMATION = "ac333ea1";

app.get("/", (req, res) => {
    res.send("VK bridge is running");
});

app.post("/callback", async (req, res) => {
    console.log("VK EVENT:", req.body);

    const event = req.body;

    // подтверждение сервера VK
    if (event.type === "confirmation") {
        return res.send(CONFIRMATION);
    }

    // входящее сообщение
   if (event.type === "message_new") {
    const msg = event.object.message;
    const userId = msg.from_id;

    const text = msg.text.toLowerCase();

    let answer = "Я не понял запрос 🤔 Попробуй спросить про питание или калории.";

    // приветствие
    if (text.includes("привет")) {
        answer = "Привет! 😊 Я твой AI-нутрициолог. Могу помочь с питанием, калориями и рационом.";
    }

    // калории
    else if (text.includes("калори")) {
        answer = "Чтобы посчитать калории, напиши: что ты ел сегодня — я разберу рацион 👍";
    }

    // похудение
    else if (text.includes("похуд")) {
        answer = "Для похудения важно: дефицит калорий, белок в каждом приёме пищи и регулярность питания 💪";
    }

    // питание / диета
    else if (text.includes("диет") || text.includes("питани")) {
        answer = "Я помогу составить тебе рацион 😊 Напиши свой рост, вес и цель.";
    }

    // вода
    else if (text.includes("вода")) {
        answer = "Рекомендуется пить 30–35 мл воды на 1 кг веса в день 💧";
    }

    await axios.post("https://api.vk.com/method/messages.send", null, {
        params: {
            access_token: VK_TOKEN,
            user_id: userId,
            message: answer,
            random_id: Date.now(),
            v: "5.199"
        }
    });

    return res.send("ok");
}
