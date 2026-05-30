const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const CONFIRMATION = "ac333ea1";

app.post("/callback", (req, res) => {
    console.log("VK EVENT:", req.body);

    if (req.body.type === "confirmation") {
        return res.send("ac333ea1");
    }

    return res.send("ok");
});
app.get("/", (req, res) => {
    res.send("VK bridge is running");
});

app.listen(PORT, () => {
    console.log("VK bridge started on port", PORT);
});