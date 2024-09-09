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

    async hello(msg){
        if (this.mode === 'gpt')
            await this.gptDialog(msg)
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
bot.onTextMessage(bot.hello);
bot.onButtonCallback(/^.*/, bot.helloButton);