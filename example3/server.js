const NATS = require('nats');
const  { v4 } = require('uuid');
const nc = NATS.connect({ json: true, servers: ['nats://localhost:5222'] });

console.log("start server");

let send = false;

nc.subscribe('newPlayer', function (msg) {
    console.log("new player" + msg);
    if (!send) {
        setInterval(() => {

            x = Math.random() * (950 - 50) + 50
            y = Math.random() * (650 - 50) + 50
            r = Math.random() * (50 - 10) + 10
            t = { id: v4(), x: x, y: y, r: r };
            console.log("send new target");
            nc.publish('newTarget', t)
        }, 1000);
    }
});





