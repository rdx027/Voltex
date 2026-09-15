const mineflayer = require('mineflayer');
const http = require('http');

// 1. خادم HTTP لإبقاء Render شغالاً 24/7 ومستجيباً للبينج
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.write("Bot Status: Active 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('🔄 جاري محاولة الاتصال بالسيرفر...');

  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me', // ضع DynIP الخاص بك إذا كنت تستخدمه
    port: 61655,                   // ضع Port الخاص بك
    username: 'Bot_247',
    version: '1.20.4'                // يتعرف على الإصدار تلقائياً
    checkTimeoutInterval: 120 * 1000 // إطالة وقت الاستجابة لعدم قطع الاتصال
  });

  bot.on('spawn', () => {
    console.log('✅ دخل البوت إلى السيرفر ولن يخرج!');

    // تسجيل الدخول في حال وجود بلجن AuthMe
    setTimeout(() => {
      bot.chat('/register BotPass123 BotPass123');
      bot.chat('/login BotPass123');
    }, 2000);

    // حركات مستمرة ومتنوعة لمنع الطرد بسب الـ AFK
    setInterval(() => {
      // 1. قفز
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);

      // 2. الالتفات ينفذ نظرة خفيفة لمنع تجميد الحساب
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 4000); // تكرار كل 4 ثوانٍ
  });

  // إذا حدث فصل طارئ من السيرفر، يعيد الاتصال فوراً خلال ثانيتين فقط
  bot.on('end', () => {
    console.log('⚠️ انقطع الاتصال، إعادة الدخول فوراً خلال ثانيتين...');
    setTimeout(createBot, 2000);
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ شبكة:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('❌ سبب الطرد:', reason);
  });
}

createBot();
