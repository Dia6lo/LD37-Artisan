class ItemHandPanel extends Widget {
    rightHand = new ItemHand(false);
    leftHand = new ItemHand(true);
    private itemHolder = new WidgetHolder();
    shownItem: DisplayableObject | undefined = undefined;
    frozen: boolean;
    showTips = true;
    private tipGroup = new Widget();
    private firstZ = true;
    private firstX = true;
    private firstCraft = true;
    private firstCraftUnique = true;
    private firstCraftCompound = true;
    private firstDisassemble = true;

    constructor(private room: Room) {
        super();
        this.size.set(440, 100);
        this.pivot = Vector2.half;
        const rightArrow = Sprite.fromImage(AssetBundle.arrow);
        rightArrow.size.set(52, 18);
        rightArrow.pivot.set(0, 0.5);
        this.tipGroup.addChild(rightArrow);
        const leftArrow = Sprite.fromImage(AssetBundle.arrow);
        leftArrow.size.set(52, 18);
        leftArrow.pivot.set(0, 0.5);
        leftArrow.scale.set(-1, 1);
        this.tipGroup.addChild(leftArrow);
        this.addChild(this.tipGroup);
        this.rightHand.position.set(this.size.x, this.size.y / 2);
        this.rightHand.tasks.add(this.handMovementTask(this.rightHand, Key.X));
        this.addChild(this.rightHand);
        this.leftHand.position.set(0, this.size.y / 2);
        this.leftHand.tasks.add(this.handMovementTask(this.leftHand, Key.Z));
        this.addChild(this.leftHand);
        this.itemHolder.pivot = Vector2.half;
        this.itemHolder.position = this.size.divide(2);
        this.addChild(this.itemHolder);
        rightArrow.position.set(this.rightHand.x - this.rightHand.width * 1.5, this.rightHand.y - this.rightHand.height / 2);
        leftArrow.position.set(this.leftHand.x + this.rightHand.width * 0.5, this.rightHand.y - this.rightHand.height / 2);
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
            this.tipGroup.opacity = this.showTips && hand.item && otherHand.item ? 1 : 0;
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
                                if (this.firstDisassemble) {
                                    const trackProperties = game.room.trackProperties;
                                    trackProperties["item"] = item.name;
                                    trackEvent("first_disassemble", trackProperties);
                                    this.firstDisassemble = false;
                                }
                            }
                            else if (this.shownItem && this.shownItem.pickable) {
                                const item = this.shownItem as Item;
                                hand.holdItem(item);
                                this.showItem(undefined);
                                item.onpickup();
                                const trackProperties = game.room.trackProperties;
                                trackProperties["item"] = item.name;
                                if (key === Key.X && this.firstX) {
                                    trackFlowEvent("first_item_right", trackProperties);
                                    this.firstX = false;
                                }
                                else if (key === Key.Z && this.firstZ) {
                                    trackFlowEvent("first_item_left", trackProperties);
                                    this.firstZ = false;
                                }
                            }
                            if (hand.x === otherHand.x && !otherHand.item) {
                                game.audio.play("assets/hlop.mp3");
                            }
                        }
                        else {
                            if (hand.x === otherHand.x && otherHand.item) {
                                const left = this.leftHand.item!;
                                const right = this.rightHand.item!;
                                const newItem = ItemFactory.mergeItems(left, right);
                                this.room.setupItem(newItem);
                                this.rightHand.holdItem(undefined);
                                this.leftHand.holdItem(newItem);
                                const trackProperties = game.room.trackProperties;
                                trackProperties["item"] = newItem.name;
                                if (this.firstCraft) {
                                    trackFlowEvent("first_craft", trackProperties);
                                    this.firstCraft = false;
                                }
                                if (newItem instanceof SimpleItem && this.firstCraftUnique) {
                                    trackEvent("first_craft_unique", trackProperties);
                                    this.firstCraftUnique = false;
                                }
                                if (newItem instanceof CompoundItem && this.firstCraftCompound) {
                                    trackEvent("first_craft_compound", trackProperties);
                                    this.firstCraftCompound = false;
                                }
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