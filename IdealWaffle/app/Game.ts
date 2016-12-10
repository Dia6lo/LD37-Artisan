class Game extends Application {
    constructor() {
        super(900, 600);
        this.renderer.backgroundColor = Color.skyblue;
        const root = new Room();
        this.root = root;
    }
}

var game: Game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};