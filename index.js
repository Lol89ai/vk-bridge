const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// временный тестовый webhook
const BOTPRESS_WEBHOOK = "https://httpbin.org/post";

// VK токен (позже заменим)
const VK_TOKEN = "PASTE_VK_TOKEN_HERE";

// VK confirmation
const CONFIRMATION = "f1ee9ecd";

app.post("/callback", async (req, res) => {
    const event = req.body;

    if (event.type === "confirmation") {
        return res.send(CONFIRMATION);
    }

    if (event.type === "message_new") {
        const msg = event.object;
        const userId = msg.from_id;
        const text = msg.text;

        try {
            await axios.post(BOTPRESS_WEBHOOK, {
                userId,
                text
            });

            await axios.post("https://api.vk.com/method/messages.send", null, {
                params: {
                    access_token: VK_TOKEN,
                    user_id: userId,
                    message: "Я получил твоё сообщение 👍",
                    random_id: Date.now(),
                    v: "5.199"
                }
            });

        } catch (err) {
            console.log(err.message);
        }

        return res.send("ok");
    }

    res.send("ok");
});

app.listen(PORT, () => {
    console.log("VK bridge started on port 3000");
});