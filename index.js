// Require the Bolt for JavaScript package (github.com/slackapi/bolt)
const { App } = require('@slack/bolt');
require('dotenv').config();
const fs = require('fs');

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Fetch users using the users.list method
async function fetchUsers() {
	// Call the users.list method using the built-in WebClient
	const result = await app.client.users.list({
		// The token you used to initialize your app
		token: process.env.SLACK_BOT_TOKEN,
	});

	return result.members;
}

function getValidUsers(userList) {
	var users = [];
	userList.forEach((item, i) => {
		if (!item.is_bot && !item.is_restricted) {
			users.push(item.real_name);
		}
	});
	return users;
}

function getRandomUsers(arr, n) {
	var result = new Array(n),
		len = arr.length,
		taken = new Array(len);
	if (n > len)
		throw new Error('getRandom: more elements taken than available');
	while (n--) {
		var x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

async function sendMessage(twoUsers) {
	// Call the chat.postMessage method using the built-in WebClient
	const result = await app.client.chat.postMessage({
		// The token you used to initialize your app is stored in the `context` object
		token: process.env.SLACK_BOT_TOKEN,
		// Payload message should be posted in the channel where original message was heard
		channel: process.env.CHANNEL,
		text: "Today's coffee is for " + twoUsers[0] + ' and ' + twoUsers[1] + '.',
	});

	return result;
}

(async () => {
	// Start your app
	try {
		var fullList = await fetchUsers(); //abstracted logic
		var users = getValidUsers(fullList); //abstracted logic
		var twoUsers = getRandomUsers(users, 2); //abstracted logic
		var result = await sendMessage(twoUsers); //abstracted logic
		console.log(result.message.text);
	} catch (err) {
		console.log(err);
	}
})();
