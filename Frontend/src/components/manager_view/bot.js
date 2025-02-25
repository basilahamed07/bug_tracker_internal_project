// bot.js
import { Bot, webhook } from 'bottender';
import express from 'express';

const app = express();
const bot = new Bot();
    
bot.onEvent(async (context) => {
  if (context.event.isText) {
    await context.sendText(`You said: ${context.event.text}`);
  }
});

app.use('/webhook', webhook(bot));

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
