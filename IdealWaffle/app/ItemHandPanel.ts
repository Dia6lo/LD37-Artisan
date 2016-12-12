class ItemHandPanel extends Widget {
    rightHand = new ItemHand(false);
    leftHand = new ItemHand(true);
    private itemHolder = new WidgetHolder();
    shownItem: DisplayableObject | undefined = undefined;

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

    showItem(item: DisplayableObject | undefined) {
        if (item) {
            this.itemHolder.content = item.displayView;
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
        let justPickedUp = false;
        let destination: number;
        while (true) {
            if (game.input.isKeyPressed(key)) {
                destination = end;
            }
            else {
                if (hand.x === end && hand.item && !justPickedUp) {
                    const item = hand.item as SimpleItem;
                    this.showItem(item);
                    item.opacity = 1;
                    hand.holdItem(undefined);
                    item.onput();
                }
                justPickedUp = false;
                destination = start;
            }
            if (hand.x !== destination) {
                const direction = Math.sign(destination - hand.x);
                const offset = direction * speed;
                hand.x += offset;
                if ((direction < 0 && hand.x < destination) || (direction > 0 && hand.x > destination)) {
                    hand.x = destination;
                }
                if (hand.x === destination && destination === end && this.shownItem && !hand.item) {
                    const item = this.shownItem as SimpleItem;
                    hand.holdItem(item);
                    item.opacity = 0;
                    this.showItem(undefined);
                    item.onpickup();
                    justPickedUp = true;
                }
            }
            yield Wait.frame();
        }
    }
}