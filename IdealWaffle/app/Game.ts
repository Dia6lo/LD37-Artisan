class Game extends Application {
    static readonly neon = Color.fromComponents(41, 196, 191);
    private state = GameState.Loading;
    readonly assets = new AssetBundle();
    private readonly loadingScreen: LoadingScreen;
    private readonly room: Room;

    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        this.assets.loaded.subscribe(this.onAssetsLoaded, this);
        this.loadingScreen = new LoadingScreen();
        this.room = new Room();
        this.root = new Widget();
        this.root.addChild(this.room);
        this.root.addChild(this.loadingScreen);
        this.renderer.imageSmoothing = false;
    }

    private onAssetsLoaded(): void {
        this.state = GameState.Loaded;
        this.root.tasks.add(this.moveOutLoadingScreenTask());
    }

    private *moveOutLoadingScreenTask() {
        for (let t of Task.linearMotion(0.5, 0, -this.renderer.height)) {
            this.loadingScreen.position.y = t;
            yield Wait.frame();
        }
        this.state = GameState.Playing;
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