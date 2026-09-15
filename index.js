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

// إبقاء الاستضافة مستيقظة 24 ساعة
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000); // كل 5 دقائق

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'voltex-smp.aternos.me',
    port: 61655,
    username: 'VoltexBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('Bot successfully joined!');

    // إرسال أوامر التسجيل والدخول فوراً
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 1500);

    // حركة مستمرة للقفز والتطلع لمنع طرد الـ AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
      bot.look(Math.random() * Math.PI * 2, 0, true);
    }, 3000);
  });

  // إذا تم طرد البوت، يرجع يدخل تلقائياً بعد 5 ثوانٍ
  bot.on('kicked', (reason) => {
    console.log('Kicked reason:', reason);
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

createBot();
