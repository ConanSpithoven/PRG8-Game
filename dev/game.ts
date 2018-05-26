class Game {

    private player : Player;

    constructor() {
        this.player = new Player;
        requestAnimationFrame(() => this.gameLoop());
    }

    private gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
    }
}