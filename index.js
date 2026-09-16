const mineflayer = require('mineflayer');

const botOptions = {
    host: 'Voltex-smp.aternos.me', // ضع هنا آيباد سيرفر ماين كرافت (أو رابط الأترنوس بدون https)
    port: 61655,        // ضع هنا البورت الخاص بالسيرفر
    name: 'Voltex-bot-99',        // اسم البوت داخل اللعبة
    version: false          // لتحديد الإصدار تلقائياً أو ضع رقم الإصدار مثل '1.20.4'
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    // عندما ينجح البوت في الدخول للسيرفر
    bot.on('spawn', () => {
        console.log('تم تسجيل دخول البوت بنجاح وثبات!');
        startAntiAfk(bot);
    });

    // إذا حدث خطأ في الاتصال
    bot.on('error', (err) => {
        console.log('حدث خطأ:', err);
    });

    // إذا خرج البوت أو انقطع الاتصال، سيحاول الدخول مرة أخرى تلقائياً
    bot.on('end', () => {
        console.log('انقطع الاتصال بالسيرفر. جاري إعادة المحاولة خلال 10 ثوانٍ...');
        setTimeout(() => {
            createBot();
        }, 10000); // 10 ثوانٍ قبل إعادة المحاولة
    });
    
    // منع طرد البوت بسبب الأخطاء الحرجة
    bot.on('kicked', (reason) => {
        console.log('تم طرد البوت بسبب:', reason);
    });
}

// دالة لمنع الخمول (Anti-AFK) حتى لا يطرد السيرفر البوت لعدم الحركة
function startAntiAfk(bot) {
    setInterval(() => {
        if (!bot.entity) return;
        // يقوم البوت بحركة بسيطة كل دقيقتين (القفز أو الالتفاف)
        bot.setControlState('jump', true);
        setTimeout(() => {
            bot.setControlState('jump', false);
        }, 500);
    }, 120000); // كل دقيقتين
}

// تشغيل البوت لأول مرة
createBot();
