class Game extends Application {
    constructor() {
        super();
        this.renderer.backgroundColor = Color.skyblue;
    }
    update(delta) {
        const root = Sprite.fromImage("assets/Logo.jpg");
        root.size = new Vector2(385, 131);
        root.pivot = Vector2.half;
        root.position = this.renderer.size.divide(2);
        this.root = root;
        this.getImagePixels();
        super.update(delta);
    }
    getImagePixels() {
        const img = new Image();
        img.onload = ev => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0, img.width, img.height);
            var imageData = context.getImageData(0, 0, img.width, img.height);
            var a = 1;
        };
        img.src = "assets/Color_Test.png";
    }
}
var game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};
//# sourceMappingURL=app.js.map