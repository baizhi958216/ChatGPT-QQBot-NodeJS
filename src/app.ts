import { createClient } from 'qqbn';
import { config } from 'dotenv';

config();
const account = parseInt(process.env.ACCOUNT as string);
const client = createClient(account, {
	platform: 4,
});
client
	.on('system.login.slider', function (e) {
		console.log('输入ticket：');
		process.stdin.once('data', (ticket) =>
			this.submitSlider(String(ticket).trim()),
		);
	})
	.login(process.env.PASSWORD);

client.on('system.login.error', (data) => {
	console.log(data);
});
