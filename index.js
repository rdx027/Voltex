const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is active 24/7');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function createBot() {
  console.log('Attempting to connect to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me',
    port: 61655,
    username: 'VoltexBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined the server!');

    // تسجيل الدخول بعد 3 ثوانٍ
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 3000);

    // حركات Anti-AFK متقدمة (قفز وتدوير الكاميرا)
    setInterval(() => {
      // قفزة خفيفة
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);

      // التفات بالرأس زاوية عشوائية كلاعب حقيقي
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 10000); // كل 10 ثوانٍ
  });

  // طباعة سبب الطرد في اللوج لمعرفة المشكلة بالضبط
  bot.on('kicked', (reason) => {
    console.log('Bot was kicked. Reason:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Connection error:', err.message);
  });
}

createBot();
