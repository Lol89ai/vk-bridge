const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// VK токен
const VK_TOKEN = "vk1.a.5n4ah8tnPzX5XncHNAICL5plIHgbErbJdwEd2efaGkn8jwtIM3Y43THqJxxyqKHjXtEvTq-wSoLrzAJYgWlgPYGtbnvkHbG4-_icoNiuyY5Pa-ip6tTipTk8abjSaAYqDyy0yl7gB-vmDhzD2Eobx_spv7drMSeQNet7Ff5TcNCte7E5ZaXtQpgi0XB1cWywo5Eq49qw3KgmMk3XLiprMA";

// подтверждение сервера VK
const CONFIRMATION = "ac333ea1";

app.get("/", (req, res) => {
    res.send("VK bridge is running");
});

app.post("/callback", async (req, res) => {
    console.log("VK EVENT:", JSON.stringify(req.body, null, 2));

    const event = req.body;

    // подтверждение сервера VK
    if (event.type === "confirmation") {
        return res.send(CONFIRMATION);
    }

    // входящее сообщение
    if (event.type === "message_new") {
        const msg = event.object.message;
        const userId = msg.from_id;

        const text = (msg.text || "").toLowerCase();

        let answer = "Я не понял запрос 🤔 Напиши: привет, калории, похудение или питание.";

        // --- ЛОГИКА НУТРИЦИОЛОГА ---

        if (text.includes("привет")) {
            answer = "Привет! 😊 Я AI-нутрициолог. Помогу с питанием, калориями и похудением.";
        }

        else if (text.includes("калори")) {
            answer = "Чтобы контролировать калории, важно знать свой дневной расход энергии. Хочешь — помогу рассчитать 👍";
        }

        else if (text.includes("похуд")) {
            answer = "Для похудения: дефицит калорий, больше белка, меньше сахара и регулярное питание 💪";
        }

        else if (text.includes("диет") || text.includes("питани")) {
            answer = "Я могу помочь составить тебе простой рацион 😊 Напиши рост, вес и цель.";
        }

        else if (text.includes("вода")) {
            answer = "Норма воды: 30–35 мл на 1 кг веса в день 💧";
        }

        else if (text.includes("еда") || text.includes("что есть")) {
            answer = "Лучше всего: белок (курица, яйца), овощи, сложные углеводы (гречка, рис) 🥗";
        }

        try {
            await axios.post("https://api.vk.com/method/messages.send", null, {
                params: {
                    access_token: VK_TOKEN,
                    user_id: userId,
                    message: answer,
                    random_id: Date.now(),
                    v: "5.199"
                }
            });
        } catch (err) {
            console.log("VK SEND ERROR:", err.message);
        }

        return res.send("ok");
    }

    return res.send("ok");
});

app.listen(PORT, () => {
    console.log("VK bridge started on port", PORT);
});
