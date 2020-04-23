const NATS = require('nats');
const { v4 } = require('uuid');
const nc = NATS.connect({ json: true, servers: ['nats://localhost:5222'] });

console.log("start server");

let rooms = {};

nc.subscribe('newPlayer.>', (msg, reply, subject, sid) => {

    subs = subject.split('.');

    if (!rooms.hasOwnProperty(subs[1])) {
        rooms[subs[1]] = {
            player: [],
            starting: 10,
            name: subs[1],
            timer: {}
        }

        rooms[subs[1]].timer = setInterval((r, t) => {
            nc.publish("startingIn." + r.name, r.starting);
            r.starting = r.starting - 1;

            if(r.starting === 0)
            {
                clearInterval(r.timer);
                startGame(r);
            }

        }, 1000, rooms[subs[1]])
    }

    rooms[subs[1]].player.push(msg);

    console.log("new player" + subs);

});

function startGame(room) {
    setInterval(() => {
        x = Math.random() * (950 - 30) + 30
        y = Math.random() * (650 - 30) + 30
        r = Math.random() * (50 - 10) + 10
        t = { id: v4(), x: x, y: y, r: r };
        console.log("send new target");
        nc.publish('newTarget.'+room.name, t)
    }, 1000);
}





