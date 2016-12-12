class ItemTooltip extends GuiFrame {
    private readonly nameLabel = new Label();

    constructor(item: Item) {
        super();
        this.nameLabel.text = item.name;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = Color.fromComponents(41, 196, 191);
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
    }

    beforeRender(renderer: Renderer): void {
        super.beforeRender(renderer);
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        const measure = new Vector2(renderer.measureText(this.nameLabel.text), fontSize);
        this.size = measure.add(new Vector2(15, 0));
        this.nameLabel.position = this.size.divide(2).subtract(new Vector2(0, 10));
        renderer.restore();
    }

    render(renderer: Renderer): void {
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        super.render(renderer);
        renderer.restore();
    }
}