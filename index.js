const mineflayer = require('mineflayer');
const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

// رابط خدمة Render الخاصة بك لمنع السكون 24/7
const RENDER_URL = 'https://voltex-c8qu.onrender.com';

app.get('/', (req, res) => {
  res.send('Bot is running 24/7 non-stop!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// إرسال طلب ذاتي كل 5 دقائق لمنع سيرفر Render من السكون (Sleep)
setInterval(() => {
  https.get(RENDER_URL, (res) => {
    console.log('Keep-Alive ping sent successfully.');
  }).on('error', (err) => {
    console.log('Ping error:', err.message);
  });
}, 5 * 60 * 1000); // كل 5 دقائق

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'knifejaw.aternos.host',
    port: 61655,
    username: 'VoltexBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined the server and will stay 24/7!');

    // تسجيل الدخول
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 2000);

    // حركات متواصلة لمنع الطرد داخل ماينكرافت
    setInterval(() => {
      bot.setControlState('forward', true);
      bot.setControlState('jump', true);

      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('jump', false);
      }, 500);

      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);
    }, 2000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 3 seconds...');
    setTimeout(createBot, 3000);
  });

  bot.on('error', (err) => {
    console.log('Connection error:', err.message);
  });
}

createBot();
