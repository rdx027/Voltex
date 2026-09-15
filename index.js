const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot Status: Active');
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me',
    port: 61655,
    username: 'VoltexBot',
    version: '1.20.1'
  });

    bot.on('spawn', () => {
    console.log('SUCCESS: Bot entered the server!');

    // انتظر 4 ثوانٍ كاملة قبل إرسال أوامر تسجيل الدخول
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 4000);

    // الحركة الخفيفة لمنع الطرد AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 15000);
  });
