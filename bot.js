import { Markup } from 'telegraf';

const image_1 = './images/1.jpg';
const image_2 = './images/2.jpg';
const image_3 = './images/3.jpg';
const image_4 = './images/4.jpg';
const image_5 = './images/5.jpg';

export class ChineseTestBot {
    constructor() {
        this.questions = [
            {
                question: "Какой иероглиф обозначает слово «гора»?",
                options: ["九", "山", "那"],
                image: image_1,
                correctAnswer: "山"
            },
            {
                question: "Какой иероглиф обозначает слово «дождь»?",
                options: ["雨", "人", "口"],
                image: image_2,
                correctAnswer: "雨"
            },
            {
                question: "Какой иероглиф обозначает слово «дерево»?",
                options: ["多", "木", "马"],
                image: image_3,
                correctAnswer: "木"
            },
            {
                question: "Какой иероглиф обозначает слово «поле»?",
                options: ["钱", "女", "田"],
                image: image_4,
                correctAnswer: "田"
            },
            {
                question: "Какой иероглиф обозначает слово «огонь»?",
                options: ["右", "火", "天"],
                image: image_5,
                correctAnswer: "火"
            }
        ];
        this.currentQuestionIndex = 0;
        this.correctQustions = 0;
        this.incorrectQustions = 0;
    }

    async startTest(ctx) {
        await this.sendQuestion(ctx, this.currentQuestionIndex);
    }

    async sendQuestion(ctx, questionIndex) {
        const question = this.questions[questionIndex];
        const options = question.options.map(option => Markup.button.callback(option, option));
        const keyboard = Markup.inlineKeyboard(options, { columns: 1 });

        await ctx.replyWithPhoto({ source: question.image }, { caption: question.question, ...keyboard });
    }

    async handleAnswer(ctx) {
        const userAnswer = ctx.callbackQuery.data;
        const question = this.questions[this.currentQuestionIndex];

        if (userAnswer === question.correctAnswer) {
            await ctx.reply('Правильно!');
            this.correctQustions++;
        } else {
            await ctx.reply('Неправильно. Правильный ответ: ' + question.correctAnswer);
            this.incorrectQustions++;
        }

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            await this.sendQuestion(ctx, this.currentQuestionIndex);
        } else {
            const message = this.correctQustions > this.incorrectQustions ? 'У вашего ребенка есть способности к изучению китайского языка!\n\nЗапишитесь на пробный урок\n\n@chinese_brikina'
                : 'У вашего ребенка есть задатки к изучению китайского языка!\n\nЗапишитесь на пробный урок\n\n@chinese_brikina'
            await ctx.reply(message);

            this.currentQuestionIndex = 0;
            this.correctQustions = 0;
            this.incorrectQustions = 0;
        }
    }
}

