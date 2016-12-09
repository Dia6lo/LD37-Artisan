class Game extends Application {
    constructor() {
        super();
        this.renderer.backgroundColor = Color.skyblue;
        const root = Sprite.fromImage("assets/Logo.jpg");
        root.size = new Vector2(385, 131);
        root.pivot = Vector2.half;
        root.tasks.add(this.moveTask(root));
        root.tasks.add(this.rotateTask(root));
        this.root = root;
    }

    update(delta: number): void {
        super.update(delta);
    }

    private *moveTask(sprite: Sprite) {
        const center = this.renderer.size.divide(2);
        const to = center.multiply(new Vector2(1.5, 1));
        const from = to.multiply(new Vector2(0.5, 1));
        sprite.position = from;
        for (let t of this.easeInOutBackMotion(2, from.x, to.x)) {
            sprite.x = t;
            yield Wait.frame();
        }
    }

    private *rotateTask(sprite: Sprite) {
        for (let t of Task.linearMotion(0.4, 0, -15)) {
            sprite.rotation = t;
            yield Wait.frame();
        }
        for (let t of Task.linearMotion(0.4, -15, 0)) {
            sprite.rotation = t;
            yield Wait.frame();
        }
        yield Wait.seconds(0.3);
        for (let t of Task.linearMotion(0.4, 0, 15)) {
            sprite.rotation = t;
            yield Wait.frame();
        }
        for (let t of Task.linearMotion(0.4, 15, 0)) {
            sprite.rotation = t;
            yield Wait.frame();
        }
    }

    private *easeInOutBackMotion(timePeriod: number, from: number, to: number) {
        for (let t of Task.motion(timePeriod, from, to, fraction => this.easeInOutBack(fraction))) {
            yield t;
        }
    }

    private easeInOutBack(x: number) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5 ?
            (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 :
            (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    getImagePixels() {
        const img = new Image();
        img.onload = ev => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext("2d")!;
            context.drawImage(img, 0, 0, img.width, img.height);
            var imageData = context.getImageData(0, 0, img.width, img.height);
            var a = 1;
        };
        img.src = "assets/Color_Test.png";
    }
}

var game: Game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};