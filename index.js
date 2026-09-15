const mineflayer = require('mineflayer');
const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

const RENDER_URL = 'https://voltex-smp-270.onrender.com';

app.get('/', (req, res) => {
  res.send('Bot Status: Online 24/7');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'voltex-smp.aternos.me',
    port: 61655, // تحديد البورت صراحة بجانب النطاق لكي يتصل عبره مباشرة دون تخمين
    username: 'VoltexBot_99',
    version: '1.20.1',
    physicsEnabled: false,
    checkTimeoutInterval: 60000
  });

  bot.once('spawn', () => {
    console.log('SUCCESS: Bot inside server securely!');
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked reason:', JSON.stringify(reason));
  });

  bot.on('end', (reason) => {
    console.log(`Connection ended (${reason}). Reconnecting in 30 seconds...`);
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => {
    console.log('Socket Error caught:', err.message);
  });
}

setTimeout(createBot, 5000);
