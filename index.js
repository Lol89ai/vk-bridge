const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👉 ВСТАВЬ СЮДА СВОЙ ТОКЕН
const VK_TOKEN = "vk1.XXXXXXX";

// подтверждение сервера VK
const CONFIRMATION = "ac333ea1";

app.post("/callback", async (req, res) => {
    console.log("VK EVENT:", req.body);

    const event = req.body;

    if (event.type === "confirmation") {
        return res.send(CONFIRMATION);
    }

    if (event.type === "message_new") {
        const msg = event.object.message;
        const userId = msg.from_id;

        await axios.post("https://api.vk.com/method/messages.send", null, {
            params: {
                access_token: VK_TOKEN,
                user_id: userId,
                message: "Я получил твоё сообщение 👍",
                random_id: Date.now(),
                v: "5.199"
            }
        });
    }

    return res.send("ok");
});

app.listen(PORT, () => {
    console.log("VK bridge started on port", PORT);
});
