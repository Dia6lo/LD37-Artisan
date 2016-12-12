class PanelObjectView extends Widget {
    private readonly tooltip: Tooltip;

    constructor(sprite: Widget, text: string, textAbove = true) {
        super();
        this.pivot = Vector2.half;
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        this.tooltip = new Tooltip(text);
        this.tooltip.position = this.size.divide(2).add(new Vector2(0, textAbove ? -sprite.height : sprite.height * 1.25));
        this.addChild(this.tooltip);
    }

    set text(value: string) {
        this.tooltip.text = value;
    }
}