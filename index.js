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

// إرسال Ping كل 5 دقائق لضمان عدم نوم Render
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655,
    username: 'VoltexBot_v2',      
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined!');

    // تأخير 3 ثوانٍ ثم إرسال أوامر التسجيل
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 3000);

    // حركة القفز لمنع طرد الـ AFK
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 4000);
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
