'use strict';

const convict = require('convict');

const config = convict({
    log: {
        name: {
            format: 'String',
            default: 'samantha',
            env: 'LOG_NAME'
        },
        level: {
            format: 'String',
            default: 'debug',
            env: 'LOG_LEVEL'
        }
    },
    slack: {
        token: {
            format: 'String',
            default: null,
            env: 'SLACK_TOKEN'
        },
        name: {
            format: 'String',
            default: 'Samantha',
            env: 'SLACK_BOT_NAME'
        },
        masterUserId: {
            format: 'String',
            default: '',
            env: 'SLACK_MASTER_USER_ID'
        }
    },
    amqp: {
        host: {
            doc: 'The host of the RabbitMQ service.',
            format: String,
            default: null,
            env: 'AMQP_HOST'
        },
        username: {
            doc: 'A RabbitMQ username.',
            format: String,
            default: null,
            env: 'AMQP_USERNAME'
        },
        password: {
            doc: 'Password for the RabbitMQ user.',
            format: String,
            default: null,
            env: 'AMQP_PASSWORD'
        },
        queue: {
            message: {
                doc: 'Queue used to have Samantha send messages in Slack',
                format: String,
                default: null,
                env: 'AMQP_QUEUE_MESSAGE'
            },
            service: {
                doc: 'Queue used to have Samantha start and stop services',
                format: String,
                default: null,
                env: 'AMQP_QUEUE_SERVICE'
            }
        },
        retry: {
            maxTries: {
                doc: 'Maximum amount of times we will try to (re)connect to AMQP.',
                format: 'int',
                default: 10,
                env: 'AMQP_RETRY_MAX_TRIES'
            },
            interval: {
                doc: 'Initial wait time between attempts in milliseconds.',
                format: 'int',
                default: 1000,
                env: 'AMQP_RETRY_INTERVAL'
            },
            backoff: {
                doc: 'Increase interval by this factor between attempts.',
                format: 'int',
                default: 2,
                env: 'AMQP_RETRY_BACKOFF'
            }
        }
    }
});

config.validate();

module.exports = config;
