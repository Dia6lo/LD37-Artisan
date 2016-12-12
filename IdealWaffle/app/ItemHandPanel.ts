class ItemHandPanel extends Widget {
    private rightHand = new ItemHand(false, "x");
    private leftHand = new ItemHand(true, "z");
    private itemHolder = new WidgetHolder();
    shownItem: Item | undefined = undefined;

    constructor() {
        super();
        this.size.set(440, 100);
        this.pivot = Vector2.half;
        this.rightHand.position.set(this.size.x, this.size.y / 2);
        this.rightHand.tasks.add(this.handMovementTask(this.rightHand, Key.X));
        this.addChild(this.rightHand);
        this.leftHand.position.set(0, this.size.y / 2);
        this.leftHand.tasks.add(this.handMovementTask(this.leftHand, Key.Z));
        this.addChild(this.leftHand);
        this.itemHolder.pivot = Vector2.half;
        this.itemHolder.position = this.size.divide(2);
        this.addChild(this.itemHolder);
    }

    showItem(item: Item | undefined) {
        if (item) {
            this.itemHolder.content = item.itemView;
        }
        else {
            this.itemHolder.clear();
        }
        this.shownItem = item;
    }

    private *handMovementTask(hand: ItemHand, key: Key) {
        const start = hand.position.x;
        const end = this.itemHolder.position.x;
        const speed = 15;
        let destination: number;
        while (true) {
            if (game.input.isKeyPressed(key)) {
                destination = end;
            }
            else {
                destination = start;
            }
            if (hand.x !== destination) {
                const direction = Math.sign(destination - hand.x);
                const offset = direction * speed;
                hand.x += offset;
                if ((direction < 0 && hand.x < destination) || (direction > 0 && hand.x > destination)) {
                    hand.x = destination;
                }
                if (hand.x === destination) {
                    if (destination === end) {
                        if (this.shownItem !== undefined) {
                            const item = this.shownItem;
                            hand.holdItem(item);
                            item.isBeingHeld = true;
                            item.opacity = 0;
                            this.showItem(undefined);
                        }
                        else if (hand.item !== undefined) {
                            const item = hand.item;
                            this.showItem(item);
                            item.isBeingHeld = false;
                            item.opacity = 1;
                            hand.holdItem(undefined);
                            item.onrelease();
                        }
                    }
                }
            }
            yield Wait.frame();
        }
    }
}

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

class GuiFrame extends NineGrid {
    constructor() {
        super(Texture.fromImage(AssetBundle.gui));
        this.left = 4;
        this.right = 4;
        this.top = 4;
        this.bottom = 4;
    }
}

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
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        const measure = new Vector2(renderer.measureText(this.nameLabel.text), fontSize);
        this.size = measure.add(new Vector2(15, 0));
        this.nameLabel.position = this.size.divide(2).subtract(new Vector2(0, 10));
        super.beforeRender(renderer);
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