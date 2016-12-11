class Game extends Application {
    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        const root = new Room();
        this.root = root;
        this.renderer.imageSmoothing = false;
    }
}

var game: Game;
window.onload = () => {
    let assets = new AssetBundle();
    assets.loaded.subscribe(() => {
        game = new Game();
        document.body.appendChild(game.view);
        game.run();
    });
    assets.load();
};