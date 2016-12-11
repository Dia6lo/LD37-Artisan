class ItemHand extends Widget {
    private contentHolder = new WidgetHolder();

    constructor(flipped: boolean, hint: string) {
        super();
        this.pivot = Vector2.half;
        const sprite = flipped ? Sprite.fromImage(AssetBundle.leftHand) : Sprite.fromImage(AssetBundle.rightHand);
        sprite.pivot = Vector2.half;
        this.addChild(sprite);
        this.contentHolder.pivot = Vector2.half;
        this.contentHolder.position.set(50, 50);
        this.addChild(this.contentHolder);
    }

    render(renderer: Renderer): void {
        renderer.save();
        game.setPixelFont(24);
        super.render(renderer);
        renderer.restore();
    }
}