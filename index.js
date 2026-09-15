const mineflayer = require('mineflayer');
const http = require('http');

// خادم لإبقاء Render نشطاً
http.createServer((req, res) => {
  res.write("Bot Status: Active 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('🔄 جاري محاولة الاتصال بالسيرفر...');

  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me', // أو الـ DynIP الخاص بك
    port: 61655,                   // أو الـ Port الخاص بك
    username: 'Bot_247',
    version: false,
    checkTimeoutInterval: 120 * 1000 // زيادة وقت المهلة لتفادي الانفصال السريع
  });

  bot.on('spawn', () => {
    console.log('✅ دخل البوت إلى السيرفر بنجاح!');
    
    // جعل البوت يلتفت ويتحرك خطوة لمنع الطرد بسب الـ AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 5000); // تكرار كل 5 ثوانٍ
  });

  bot.on('kicked', (reason) => {
    console.log('❌ تم طرد البوت. السبب:', JSON.stringify(reason));
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ في الاتصال:', err.message);
  });

  bot.on('end', () => {
    console.log('⚠️ تم فصل البوت، إعادة الاتصال خلال 10 ثوان...');
    setTimeout(createBot, 10000);
  });
}

createBot();
