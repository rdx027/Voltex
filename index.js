const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is running 24/7');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function createBot() {
  console.log('Attempting to connect to Minecraft server...');

  const bot = mineflayer.createBot({
    host: 'knifejaw.aternos.host',
    port: 61655,
    username: 'VoltexBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('SUCCESS: Bot joined the server!');
    
    setTimeout(() => {
      bot.chat('/register 123456789 123456789');
      bot.chat('/login 123456789');
    }, 2000);

    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 15000);
  });

  bot.on('end', () => {
    console.log('Connection lost. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Network error:', err.message);
  });
}

createBot();
