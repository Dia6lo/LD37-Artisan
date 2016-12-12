class ItemHandPanel extends Widget {
    rightHand = new ItemHand(false);
    leftHand = new ItemHand(true);
    private itemHolder = new WidgetHolder();
    shownItem: DisplayableObject | undefined = undefined;
    frozen: boolean;

    constructor(private room: Room) {
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
        const otherHand = hand === this.rightHand ? this.leftHand : this.rightHand;
        const start = hand.position.x;
        const end = this.itemHolder.position.x;
        const speed = 15;
        let destination: number;
        while (true) {
            if (this.frozen) {
                yield Wait.frame();
                continue;
            }
            if (game.input.isKeyPressed(key)) {
                destination = end;
            }
            else {
                if (hand.x === end && hand.item && !hand.justPickedUp) {
                    const item = hand.item as SimpleItem;
                    this.showItem(item);
                    hand.holdItem(undefined);
                    item.onput();
                }
                hand.justPickedUp = false;
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
                        if (this.shownItem && !this.shownItem.pickable) {
                            if (this.shownItem.oninteract(hand.item)) {
                                hand.holdItem(undefined);
                            }
                            else {
                                hand.justPickedUp = true;
                            }
                        }
                        else if (!hand.item) {
                            if (hand.x === otherHand.x && otherHand.item && otherHand.item instanceof CompoundItem) {
                                const item = otherHand.item;
                                this.leftHand.holdItem(item.parts[0]);
                                this.rightHand.holdItem(item.parts[1]);
                            }
                            else if (this.shownItem && this.shownItem.pickable) {
                                const item = this.shownItem as Item;
                                hand.holdItem(item);
                                this.showItem(undefined);
                                item.onpickup();
                            }
                            if (hand.x === otherHand.x && !otherHand.item) {
                                game.audio.play("assets/hlop.mp3");
                            }
                        }
                        else {
                            if (hand.x === otherHand.x && otherHand.item) {
                                const newItem = ItemFactory.mergeItems(this.leftHand.item!, this.rightHand.item!);
                                this.room.setupItem(newItem);
                                this.rightHand.holdItem(undefined);
                                this.leftHand.holdItem(newItem);
                            }
                            /*else if (this.shownItem) {
                                const newItem = ItemFactory.mergeItems(hand.item, this.shownItem as Item);
                                this.room.setupItem(newItem);
                                hand.holdItem(newItem);
                                this.shownItem.onpickup();
                                this.showItem(undefined);
                            }*/
                        }
                    }
                }
            }
            yield Wait.frame();
        }
    }
}