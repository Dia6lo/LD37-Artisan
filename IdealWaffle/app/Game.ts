class Game extends Application {
    static readonly neon = Color.fromComponents(41, 196, 191);
    readonly assets = new AssetBundle();
    private readonly loadingScreen: FadeScreen;
    private readonly room: Room;

    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        this.assets.loaded.subscribe(this.onAssetsLoaded, this);
        this.loadingScreen = new FadeScreen(554);
        this.room = new Room();
        this.root = new Widget();
        this.root.addChild(this.room);
        this.root.addChild(this.loadingScreen);
        this.renderer.imageSmoothing = false;
    }

    private onAssetsLoaded(): void {
        this.loadingScreen.fadeOut();
    }

    run(): void {
        super.run();
        this.assets.load();
    }

    setPixelFont(size: number) {
        this.renderer.context.font = `${size}px tooltipFont`;
    }
}

var game: Game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};