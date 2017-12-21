'use strict';

const bunyan = require('bunyan');
const SlackBot = require('slackbots');
const tv4 = require('tv4');

const config = require('../config');
const Queue = require('./queue');
const schema = require('./message-schema');

const logger = bunyan.createLogger({
    name: config.get('log.name'),
    level: config.get('log.level'),
    serializers: bunyan.stdSerializers
});

const queue = new Queue({ config, logger });

const bot = new SlackBot({
    token: config.get('slack.token'),
    name: config.get('slack.name')
});
const defaultBotParams = {
    as_user: true // eslint-disable-line camelcase
};

bot.on('start', () => {

    queue.on('listen', () => {
        bot.postMessageToChannel('general', 'Meow!', defaultBotParams);
    });

    queue.on('message', message => {
        try {
            message = JSON.parse(message);
        } catch (e) {
            logger.error({ message }, 'The received message is not valid JSON');
            return;
        }

        const valid = tv4.validate(message, schema);
        if (!valid) {
            logger.error({ err: tv4.error }, 'Received an invalid message');
            return;
        }

        let operation;
        switch (message.recipient.type) {
            case 'user':
                operation = bot.postMessageToUser;
                break;
            case 'channel':
            default:
                operation = bot.postMessageToChannel;
                break;
        }
        operation.call(bot, message.recipient.name, message.message, defaultBotParams);
    });

    queue.start();
});

bot.on('message', data => {
    if (data.type !== 'message') {
        return;
    }
    if (config.get('slack.masterUserId') !== data.user) {
        return;
    }
    const match = data.text.match(/service (start|stop) (.*)/);
    if (!match || match.length !== 3) {
        return;
    }
    queue.publish(JSON.stringify({
        name: match[2],
        command: match[1]
    }));
});

bot.on('error', err => {
    logger.error({ err }, 'Samantha is having some problems');
    queue.stop();
});

bot.on('close', err => {
    logger.error({ err }, 'Samantha got disconnected');
    queue.stop();
});
