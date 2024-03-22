const readline = require('readline');

class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
    }
}

class SnakeAndLadderGame {
    constructor() {
        this.board = new Array(101).fill(0);
        this.players = [];
        this.snakes = [];
        this.ladders = [];
        this.winner = null;
    }

    addSnake(head, tail) {
        this.snakes.push({ head, tail });
    }

    addLadder(start, end) {
        this.ladders.push({ start, end });
    }

    addPlayer(name) {
        this.players.push(new Player(name));
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    movePlayer(player) {
        const diceValue = this.rollDice();
        const newPosition = player.position + diceValue;

        console.log(`${player.name} rolled a ${diceValue} and moved from ${player.position} to ${newPosition}`);

        if (newPosition <= 100) {
            player.position = this.getNextPosition(newPosition);
            if (player.position === 100) {
                this.winner = player;
            }
        }
    }

    getNextPosition(position) {
        for (const snake of this.snakes) {
            if (snake.head === position) {
                return snake.tail;
            }
        }
        for (const ladder of this.ladders) {
            if (ladder.start === position) {
                return ladder.end;
            }
        }
        return position;
    }

    play() {
        while (!this.winner) {
            for (const player of this.players) {
                this.movePlayer(player);
                if (this.winner) {
                    break;
                }
            }
        }
        console.log(`${this.winner.name} wins the game`);
    }
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let s, l, p;
    let snakes = [];
    let ladders = [];
    let players = [];

    rl.question("Number of snakes (s): ", (sInput) => {
        s = parseInt(sInput);
        getSnakes();
    });

    function getSnakes() {
        let count = 0;
        (function next() {
            if (count === s) {
                getLadders();
                return;
            }
            rl.question(`Enter snake ${count + 1} in the format "head tail":\n`, (line) => {
                const [head, tail] = line.split(" ").map(Number);
                snakes.push({ head, tail });
                count++;
                if (count === s) {
                    getLadders();
                } else {
                    next();
                }
            });
        })();
    }

    function getLadders() {
        rl.question("Number of ladders (l): ", (lInput) => {
            l = parseInt(lInput);
            let count = 0;
            (function next() {
                if (count === l) {
                    getPlayers();
                    return;
                }
                rl.question(`Enter ladder ${count + 1} in the format "start end":\n`, (line) => {
                    const [start, end] = line.split(" ").map(Number);
                    ladders.push({ start, end });
                    count++;
                    if (count === l) {
                        getPlayers();
                    } else {
                        next();
                    }
                });
            })();
        });
    }

    function getPlayers() {
        rl.question("Number of players (p): ", (pInput) => {
            p = parseInt(pInput);
            let count = 0;
            (function next() {
                if (count === p) {
                    rl.close();
                    startGame(snakes, ladders, players);
                    return;
                }
                rl.question(`Enter player ${count + 1} name:\n`, (name) => {
                    players.push(name);
                    count++;
                    if (count === p) {
                        startGame(snakes, ladders, players);
                    } else {
                        next();
                    }
                });
            })();
        });
    }
}

function startGame(snakes, ladders, players) {
    const game = new SnakeAndLadderGame();

    snakes.forEach(({ head, tail }) => game.addSnake(head, tail));
    ladders.forEach(({ start, end }) => game.addLadder(start, end));
    players.forEach(name => game.addPlayer(name));

    game.play();
}

main();
