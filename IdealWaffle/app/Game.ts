class Game extends Application {
    static readonly neon = Color.fromComponents(41, 196, 191);
    room: Room;

    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        this.renderer.imageSmoothing = false;
    }

    run(): void {
        this.room = new Room();
        this.root = this.room;
        super.run();
        const assetLoadEvent = "asset_loading";
        assets.loaded.subscribe(() => {
            appInsights.stopTrackEvent(assetLoadEvent);
            timer.reset();
        });
        assets.load();
        appInsights.startTrackEvent(assetLoadEvent);
    }

    setPixelFont(size: number) {
        this.renderer.context.font = `${size}px tooltipFont`;
    }

    update(delta: number): void {
        timer.add(delta);
        super.update(delta);
    }
}

class Timer {
    total = 0;
    last = 0;

    add(seconds: number) {
        this.total += seconds;
        this.last += seconds;
    }

    reset() {
        this.last = 0;
    }
}

var timer = new Timer();
var assets = new AssetBundle();
var game: Game;

var trackEvent = (name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) => {
    appInsights.trackEvent(name, properties, measurements);
}

var trackFlowEvent = (name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) => {
    if (!measurements) {
        measurements = { };
    }
    measurements["event_time"] = timer.total;
    measurements["total_time"] = timer.last;
    console.debug(`${timer.last} ${timer.total}`);
    timer.reset();
    appInsights.trackEvent(name, properties, measurements);
}

window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};