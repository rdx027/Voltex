const mineflayer = require('mineflayer');
const http = require('http');

// خادم HTTP لإبقاء الخدمة نشطة على Render
http.createServer((req, res) => {
  res.write("Bot Status: Active 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('🔄 جاري محاولة الاتصال بالسيرفر...');

  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me', // استبدله بـ DynIP إذا استمر عدم الدخول
    port: 61655,                   // استبدله بـ Port الـ DynIP
    username: 'Bot_247',
    version: '1.20.1'
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('✅ دخل البوت إلى السيرفر بنجاح!');
  });

  bot.on('kicked', (reason) => {
    console.log('❌ تم طرد البوت. السبب:', reason);
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ في الاتصال:', err.message);
  });

  bot.on('end', () => {
    console.log('⚠️ انفصل البوت. إعادة المحاولة بعد 15 ثانية...');
    setTimeout(createBot, 15000);
  });
}

createBot();
