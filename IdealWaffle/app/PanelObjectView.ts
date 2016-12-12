class PanelObjectView extends Widget {
    constructor(sprite: Widget, text: string) {
        super();
        this.pivot = Vector2.half;
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        const tooltip = new Tooltip(text);
        tooltip.position = this.size.divide(2).subtract(new Vector2(0, sprite.height));
        this.addChild(tooltip);
    }
}