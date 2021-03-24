const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const wol = require("wol");

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
    return res.send("pong");
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/wol-tv", (req, res) => {
    wol.wake("10:08:B1:54:9B:B2", function (err, wolres) {
        res.send({ success: wolres });
    });
});

app.listen(process.env.PORT || 8080);
