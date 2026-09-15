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

// إبقاء Render مستيقظاً كل 5 دقائق
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Connecting to Minecraft server...');

  const bot = mineflayer.createBot({
    host: '185.107.192.98',
    port: 61655, // تأكد من البورت الحالي من Aternos
    username: 'Voltex_Silent',
    version: '1.20.1',
    checkTimeoutInterval: 60 * 1000 // رفع مهلة التحقق لمنع الفصل التلقائي
  });

  // تعطيل الفيزياء والجاذبية فور الانضمام لتفادي Invalid move packet
  bot.once('spawn', () => {
    console.log('SUCCESS: Bot inside server!');

    if (bot.physics) {
      bot.physics.enabled = false; // إلغاء حسابات الحركة والفيزياء بالكامل
    }

    // التفاف الرؤية البسيط فقط لمنع طرد الـ AFK
    setInterval(() => {
      if (bot.entity) {
        bot.look(Math.random() * Math.PI * 2, 0, true);
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
