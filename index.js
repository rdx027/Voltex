const mineflayer = require('mineflayer');
const http = require('http');

// خادم بسيط لإبقاء البوت حياً على Render
http.createServer((req, res) => {
  res.write("Bot is Alive!");
  res.end();
}).listen(process.env.PORT || 3000);

// إعدادات بوت الماين كرافت
function createBot() {
  const bot = mineflayer.createBot({
    host: 'Voltex-smp.aternos.me',
    port: 61655,
    username: 'Bot_247',
    version: false
  });

  bot.on('spawn', () => {
    console.log('✅ دخل البوت إلى السيرفر بنجاح!');
  });

  // الرد على الرسائل تلقائياً
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!ping') {
      bot.chat('Pong! البوت شغال 24/7 🔥');
    }
  });

  // إعادة الاتصال تلقائياً عند الخروج أو الرسوب
  bot.on('end', () => {
    console.log('⚠️ تم فصل البوت، إعادة الاتصال خلال 10 ثوانٍ...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => console.log('خطأ:', err));
}

createBot();
