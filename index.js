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

// إرسال Ping كل 5 دقائق لتبقى استضافة Render مستيقظة
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655, // تأكد من البورت الحالي في Aternos
    username: 'Voltex_Silent', // اسم جديد لتفادي أي حظر سابق
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot inside server (No Chat / Silent)!');

    // قفز خفيف فقط لمنع طرد الـ AFK بدون كتابة أي شيء في الشات
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
    // الانتظار 25 ثانية قبل إعادة الاتصال لتجاوز حظر Connection throttled
    console.log('Disconnected. Reconnecting in 25 seconds...');
    setTimeout(createBot, 25000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

// مهلة 10 ثوانٍ قبل أول اتصال لتنظيف المحاولات القديمة
setTimeout(createBot, 10000);
