const mineflayer = require('mineflayer');
const express = require('express');

// خادم ويب وهمي لإرضاء استضافة Render ومنع إغلاق التطبيق
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running and alive!');
});

app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
});

// إعدادات بوت ماين كرافت (صامت تماماً ولا يكتب أي شيء في الشات)
const botOptions = {
    host: 'voltex-smp.aternos.me', // ضع الآيبي المباشر هنا
    port: 61655,                  // ضع البورت هنا
    name: 'Voltex-ssmp',        // اسم البوت داخل اللعبة
    version: false                // تحديد الإصدار تلقائياً
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('تم تسجيل دخول البوت بنجاح وثبات!');
        startAntiAfk(bot);
    });

    bot.on('error', (err) => {
        console.log('حدث خطأ:', err);
    });

    bot.on('end', () => {
        console.log('انقطع الاتصال بالسيرفر. جاري إعادة المحاولة خلال 10 ثوانٍ...');
        setTimeout(() => {
            createBot();
        }, 10000);
    });
    
    bot.on('kicked', (reason) => {
        console.log('تم طرد البوت بسبب:', reason);
    });
}

// دالة حماية من الخمول (تقوم بالقفز فقط بهدوء دون إزعاج أو كتابة أي رسائل)
function startAntiAfk(bot) {
    setInterval(() => {
        if (!bot.entity) return;
        bot.setControlState('jump', true);
        setTimeout(() => {
            bot.setControlState('jump', false);
        }, 500);
    }, 120000); // كل دقيقتين
}

createBot();
