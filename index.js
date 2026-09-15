const mineflayer = require('mineflayer');
const express = require('express');

// --- إنشاء سيرفر HTTP لمنع Render من النوم ---
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('البوت شغال 24/7 بنجاح!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// --- إعدادات البوت ---
function createBot() {
  console.log('🔄 جاري محاولة الاتصال بالسيرفر...');

  const bot = mineflayer.createBot({
    host: 'knifejaw.aternos.host', //  DynIP من Aternos بدون البورت
    port: 61655,                   // ضع رقم الـ Port الجديد من Aternos
    username: 'VoltexBot',
    version: '1.20.1'
  });

  // تسجيل الدخول والتحرك تلقائياً (Anti-AFK)
  bot.on('spawn', () => {
    console.log('✅ دخل البوت إلى السيرفر ولن يخرج!');
    
    // تسجيل الدخول أو التسجيل تلقائياً
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 2000);

    // التحرك الدائم لتفادي الطرد بسبب الـ AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 15000);
  });

  // إعادة الاتصال التلقائي عند الانقطاع
  bot.on('end', () => {
    console.log('⚠️ انقطع الاتصال، إعادة الدخول فوراً خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ شبكة:', err.message);
  });
}

createBot();
