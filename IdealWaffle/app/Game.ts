class Game extends Application {
    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.skyblue;
        const root = new Room();
        this.root = root;
        this.renderer.imageSmoothing = false;
    }
}

var game: Game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};