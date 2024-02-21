import {Markup, Telegraf} from 'telegraf';
import { ChineseTestBot } from './bot.js';
import { config } from 'dotenv';

config();

const bot = new Telegraf(process.env.API_KEY);
const chineseTestBot = new ChineseTestBot();

bot.telegram.setMyCommands([
    {
        command: 'test_start',
        description: 'Начать тест',
    }
]);

const welcome_action = Markup.inlineKeyboard([
    [Markup.button.callback('Начать тест', 'test_start')],
]);

bot.start((ctx) => ctx.reply('Узнайте сможет ли ваш ребёнок учить китайский язык. \n\n'
    + 'Тест состоит из 5 вопросов, которые помогут окунуться в язык', welcome_action));

bot.on('message', (ctx) => {
    console.log(ctx.message.chat);
});

bot.action('test_start', async (ctx) => {
    chineseTestBot.startTest(ctx);
});

bot.on('callback_query', async (ctx) => {
    chineseTestBot.handleAnswer(ctx);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
