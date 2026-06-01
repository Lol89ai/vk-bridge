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

        try {
            // отправляем сообщение в Botpress
            const bp = await axios.post(BOTPRESS_WEBHOOK, {
                userId: String(userId),
                text: msg.text
            });
            console.log("BOTPRESS FULL:", JSON.stringify(bp.data, null, 2));

            let answer = "Я не получил ответ от AI 😔";

            // пытаемся достать ответ Botpress
            if (bp.data) {
                if (bp.data.responses && bp.data.responses[0]) {
                    answer = bp.data.responses[0].text;
                } else if (typeof bp.data === "string") {
                    answer = bp.data;
                }
            }

            // отправляем ответ в VK
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
            console.log("BOT ERROR:", err.message);
        }

        return res.send("ok");
    }

    return res.send("ok");
});

app.listen(PORT, () => {
    console.log("VK bridge started on port", PORT);
});
