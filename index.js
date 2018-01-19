const amqp = require('amqplib/callback_api');
const uniqid = require('uniqid');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        if (err) {
            console.error('Failed to create Rabbit channel');
            console.error(err);
            process.exit(1); // no reason to continue without a channel
        }

        const q   = 'hello';

        let text = process.argv[2] || '';

        // in addition to the text, it sends a unique identificator
        // (for duplicate recognition on the server side)

        let msg  = JSON.stringify({uid: uniqid(), val: text});

        // set durable and persistent flags to avoid losing messages

        ch.assertQueue(q, {durable: true});
        ch.sendToQueue(q, new Buffer(msg), {persistent: true});
        console.log(` [x] Sent "${text}"`);
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);
});