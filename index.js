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

// إرسال Ping كل 5 دقائق لضمان عدم نوم Render
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655, // تأكد من البورت الحالي في Aternos
    username: 'Voltex_Silent',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot inside server!');

    // تغيير زاوية الرؤية فقط كل 4 ثوانٍ لمنع الـ AFK بدون أي حركة مكانية تسبب طرد
    setInterval(() => {
      if (bot.entity) {
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }
    }, 4000);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked reason:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 25 seconds...');
    setTimeout(createBot, 25000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

setTimeout(createBot, 5000);
