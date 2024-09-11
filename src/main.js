const {HtmlTelegramBot} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    async start() {
        this.mode = 'main'
        const text = this.loadMessage('main')
        await this.sendImage('main')
        await this.sendText(text)

        await this.showMainMenu({
            'start': 'главное меню бота',
            'profile': 'генерация Tinder-профиля 😎',
            'opener': 'сообщение для знакомства 🥰',
            'message': 'переписка от вашего имени 😈',
            'date': 'переписка со звездами 🔥',
            'gpt': 'задать вопрос чату GPT 🧠',
            'html': 'Демонстрация HTML',
        })
    }

    async html() {
        await this.sendHTML('<h3 style="color:#1558b0"> Привет! </h3>')
        const html = this.loadHtml('main')
        await this.sendHTML(html, {theme: 'dark'})
    }

    async gpt(){
        this.mode = 'gpt';
        const text = this.loadMessage('gpt')
        await this.sendImage('gpt')
        await this.sendText(text)
    }

    async gptDialog(msg) {
        const text = msg.text;
        const answer = await chatgpt.sendQuestion('Ответь на вопрос', text)
        await this.sendText(answer)
    }

    async date() {
        this.mode = 'date'
        const text = this.loadMessage('date')
        await this.sendImage('date')
        await this.sendTextButtons(text, {
            'date_grande': 'Ариана Гранде',
            'date_lawrence': 'Дженнифер Лоуренс',
            'date_robbie': 'Марго Робби',
            'date_zendaya': 'Зендея',
            'date_gosling': 'Райан Гослинг',
            'date_hardy': 'Том Харди',
        })
    }

    async dateButton(callbackQuery) {
        const query = callbackQuery.data;
        await this.sendText(query);
        await this.sendImage(query)
        await this.sendText('Отличный выбор! Пригласи девушку/парня на свидание за 5 сообщений:')
        const prompt = this.loadPrompt(query)
        await chatgpt.setPrompt(prompt);
    }

    async dateDialog(msg) {
        const text = msg.text;
        const myMessage = await this.sendText('Девушка набирает текст...')
        const answer = await chatgpt.addMessage(text);
        await this.editText(myMessage, answer);
    }

    async message(msg) {
        this.mode = 'message';
        const text = this.loadMessage('message');
        await this.sendImage('message');
        await this.sendText(text);
    }

    async messageButton(callbackQuery) {

    }

    async messageDialog(msg) {

    }

    async

    async hello(msg){
        if (this.mode === 'gpt')
            await this.gptDialog(msg)
        else if (this.mode === 'date')
            await this.dateDialog(msg)
        else if (this.mode === 'message')
            await this.messageDialog(msg)
        else {
            const text = msg.text;
            await this.sendText('<b>Привет!</b>')
            await this.sendText('<i>Как дела?</i>')
            await this.sendText(`Вы писали: ${text}`)

            await this.sendImage('avatar_main')
            await this.sendTextButtons('Какая у вас тема в Телеграм?', {
                'theme_light': 'Светлая',
                'theme_dark': 'Темная',
            })
        }
    }

    async helloButton(callbackQuery) {
        const query = callbackQuery.data;
        if (query === 'theme_light'){
            await this.sendText('У вас светлая тема')
        }
        else if (query === 'theme_dark') {
            await this.sendText('У вас темная тема')
        }
    }

}

const chatgpt = new ChatGptService('gpt:9p4dgMGH8xaays5cTFbEJFkblB3TGdVvUMGZg2yosnt0BhOs');
const bot = new MyTelegramBot('7515364389:AAG8j4mpKksYrWcL-HRR9-5FGtgjQGtkAQo');

bot.onCommand(/\/start/, bot.start); // /start
bot.onCommand(/\/html/, bot.html); // /html
bot.onCommand(/\/gpt/, bot.gpt); // /gpt
bot.onCommand(/\/date/, bot.date); // /date
bot.onCommand(/\/message/, bot.message); // /message

bot.onTextMessage(bot.hello);
bot.onButtonCallback(/^date_.*/, bot.dateButton);
bot.onButtonCallback(/^date_.*/, bot.dateButton);
bot.onButtonCallback(/^.*/, bot.messageButton);