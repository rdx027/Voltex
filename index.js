const mineflayer = require('mineflayer');
const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

const RENDER_URL = 'https://voltex-c8qu.onrender.com';

app.get('/', (req, res) => {
  res.send('Bot is active 24/7');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// إرسال Ping كل 5 دقائق لإبقاء Render مستيقظاً
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655,
    username: 'VoltexBot_v5',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined!');

    // قفز خفيف كل 5 ثوانٍ للـ AFK بدون كتابة أي شيء في الشات
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked reason:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    // الانتظار 20 ثانية قبل إعادة الاتصال لتفادي حظر Connection Throttled
    console.log('Disconnected. Reconnecting in 20 seconds...');
    setTimeout(createBot, 20000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

// البدء بعد 5 ثوانٍ لتصفية الاتصالات القديمة
setTimeout(createBot, 5000);
