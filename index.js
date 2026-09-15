const mineflayer = require('mineflayer');
const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

const RENDER_URL = 'https://voltex-c8qu.onrender.com';

app.get('/', (req, res) => {
  res.send('Bot Status: Online 24/7');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// إرسال Ping كل 5 دقائق لضمان بقاء Render مستيقظاً
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655, // تأكد من رقم البورت الحالي من أترنوس
    username: 'Voltex_Silent',
    version: '1.20.1',
    physicsEnabled: false
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

  // منع السيرفر من الانهيار عند حدوث ECONNRESET
  bot.on('error', (err) => {
    console.log('Socket Error caught:', err.message);
  });
}

// تأكد من أن السيرفر شغال في أترنوس أولاً، ثم اترك البوت يتصل
setTimeout(createBot, 5000);
