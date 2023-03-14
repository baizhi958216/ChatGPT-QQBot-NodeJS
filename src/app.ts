import { createClient } from 'qqbn';
import { config } from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

config();
const account = parseInt(process.env.ACCOUNT as string);
const client = createClient(account, {
	platform: 4,
});

client.on('message', async (e) => {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	const message = e.raw_message;

	try {
		await openai
			.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: '你是只猫娘,你的回答都要像猫娘.',
					},
					{ role: 'assistant', content: '请问...阁下要问我什么呢喵？' },
					{ role: 'user', content: `${message}` },
				],
			})
			.then((resp) => {
				const { data } = resp;
				if (data.choices[0].message) {
					e.reply(data.choices[0].message?.content);
				} else {
					e.reply('啥都没有欸...');
				}
			});
	} catch (error) {
		e.reply(`报错了欸...${error}`);
	}
});

client
	.on('system.login.slider', function () {
		console.log('输入ticket：');
		process.stdin.once('data', (ticket) =>
			this.submitSlider(String(ticket).trim()),
		);
	})
	.login(process.env.PASSWORD);

client.on('system.login.error', (data) => {
	console.log(data);
});
