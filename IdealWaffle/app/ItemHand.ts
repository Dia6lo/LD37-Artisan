class ItemHand extends Widget {
    private hint = new Label();
    private contentHolder = new WidgetHolder();

    constructor(flipped: boolean, hint: string) {
        super();
        this.pivot = Vector2.half;
        const sprite = Sprite.fromImage(AssetBundle.itemHand);
        sprite.pivot = Vector2.half;
        if (flipped) {
            sprite.scale.x = -1;
        }
        this.addChild(sprite);
        this.hint.text = hint;
        this.hint.pivot = Vector2.half;
        this.hint.horizontalTextAlignment = TextAlignment.Center;
        this.hint.verticalTextAlignment = TextAlignment.Center;
        this.contentHolder.pivot = Vector2.half;
        this.contentHolder.content = this.hint;
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