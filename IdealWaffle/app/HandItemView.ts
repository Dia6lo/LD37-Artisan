class HandItemView extends Widget {
    constructor(item: Item) {
        super();
        this.pivot = Vector2.half;
        const sprite = item.createSprite();
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        const tooltip = new ItemTooltip(item);
        tooltip.position = this.size.divide(2).subtract(new Vector2(0, sprite.height));
        this.addChild(tooltip);
    }
}