class PanelObjectView extends Widget {
    constructor(sprite: Widget, text: string, textAbove = true) {
        super();
        this.pivot = Vector2.half;
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        const tooltip = new Tooltip(text);
        tooltip.position = this.size.divide(2).add(new Vector2(0, textAbove ? -sprite.height : sprite.height * 1.25));
        this.addChild(tooltip);
    }
}