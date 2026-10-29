const mineflayer = require('mineflayer');
const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;
const RENDER_URL = 'https://voltex-smp09.onrender.com'; // رابط خدمتك على رندر

app.get('/', (req, res) => {
  res.send('VoltexBot is active 24/7!');
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// إرسال طلب كل 5 دقائق لإبقاء Render مستيقظاً
setInterval(() => {
  https.get(RENDER_URL, () => {}).on('error', () => {});
}, 300000);

function createBot() {
  console.log('Attempting to connect to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'Voltex-SMP.aternos.me',
    port: 61655,
    username: 'By_RDX',
    version: '1.20.1',
    checkTimeoutInterval: 60000
  });

  bot.once('spawn', () => {
    console.log('SUCCESS: Bot inside server securely!');
    
    // نظام حركة مضاد للـ AFK: يقفز ويستدير كل 12 ثانية
    setInterval(() => {
      // قفزة قصيرة
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 400);

      // التفاتة بسيطة بالكاميرا
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);

    }, 12000);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', JSON.stringify(reason));
  });

  bot.on('end', (reason) => {
    console.log(`Disconnected (${reason}). Reconnecting in 30 seconds...`);
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

setTimeout(createBot, 5000);
