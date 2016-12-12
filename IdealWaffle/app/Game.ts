class Game extends Application {
    static readonly neon = Color.fromComponents(41, 196, 191);
    readonly room: Room;

    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        this.renderer.imageSmoothing = false;
    }

    run(): void {
        this.root = new Room();
        super.run();
        assets.load();
    }

    setPixelFont(size: number) {
        this.renderer.context.font = `${size}px tooltipFont`;
    }
}

var assets = new AssetBundle();
var game: Game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};