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

class ItemHandPanel extends Widget {
    private rightHand = new ItemHand(false, "x");
    private leftHand = new ItemHand(true, "z");
    private itemHolder = new WidgetHolder();

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

    showItem(item: Item) {
        item.highlighted = true;
        item.position = Vector2.zero;
        item.pivot = Vector2.half;
        this.itemHolder.content = item;
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
            }
            yield Wait.frame();
        }
    }
}