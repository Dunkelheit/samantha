'use strict';

const AMQP = require('amqpimping');

class Queue extends AMQP {

    constructor({ config, logger }) {
        super({
            host: config.get('amqp.host'),
            username: config.get('amqp.username'),
            password: config.get('amqp.password'),
            logger,
            retry: {
                maxTries: config.get('amqp.retry.maxTries'),
                interval: config.get('amqp.retry.interval'),
                backoff: config.get('amqp.retry.backoff')
            }
        });
        this.queue = config.get('amqp.queue');
    }

    start() {
        this.on('connect', () => {
            super.listen(this.queue);
        });
        super.connect();
    }
}

module.exports = Queue;
