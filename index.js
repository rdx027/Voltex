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

// إرسال Ping كل 5 دقائق لضمان بقاء Render مستيقظاً
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655, 
    username: 'VoltexBot_v3',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined!');

    // إرسال أمر الدخول فقط بعد 4 ثوانٍ من الانضمام
    setTimeout(() => {
      bot.chat('/login 123456789');
    }, 4000);

    // إذا لم يكن مسجلاً سابقاً، يرسل التسجيل بعد 7 ثوانٍ
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
    }, 7000);

    // حركة قفز خفيفة كل 5 ثوانٍ لمنع طرد الـ AFK
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
    console.log('Disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

createBot();
