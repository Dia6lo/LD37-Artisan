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
        super.update(delta);
    }
}
var game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};
//# sourceMappingURL=app.js.map