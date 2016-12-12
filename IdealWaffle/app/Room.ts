class Room extends Widget {
    private room = Sprite.fromImage(AssetBundle.room);
    private player = new Player();
    private transformer = new PositionTransformer();
    private playerPosition = new Vector2(50, 50);
    private characterSpeed = 0.30;
    private mousePosition: Vector2;
    private debug = new Label();
    private cityParallax = new CityParallax();
    private itemHandPanel: ItemHandPanel;
    private items: Item[] = [];
    private roomObjects = new Widget();

    constructor() {
        super();
        this.itemHandPanel = new ItemHandPanel(this);
        this.cityParallax.position = new Vector2(304, 76);
        this.addChild(this.cityParallax);
        this.room.size = new Vector2(886, 554);
        this.player.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        const light = Sprite.fromImage(AssetBundle.light);
        light.size = new Vector2(440, 440);
        light.pivot = Vector2.half;
        light.position = new Vector2(446, 132);
        light.opacity = 0.8;
        this.tasks.add(this.updateLightTask(light));
        this.addChild(this.roomObjects);
        this.roomObjects.addChild(this.player);
        this.addChild(light);
        this.itemHandPanel.position.set(485, 120);
        this.addChild(this.itemHandPanel);
        document.body.onmousemove = ev => {
            this.mousePosition = new Vector2(ev.x - game.renderer.view.offsetLeft, ev.y - game.renderer.view.offsetTop);
        };
        this.debug.fontColor = Color.white;
        //this.addChild(this.debug);
        //const newsLabel = new Label("tention: You must stay in your houses *** Want to enlarge your self-esteem?");
        //newsLabel.fontColor = Color.fromComponents(41, 196, 191);
        //newsLabel.position.set(-10, 505);
        //this.addChild(newsLabel);
        const apple = this.createItem(ItemType.Apple);
        const apple1 = this.createItem(ItemType.Apple);
        const apple2 = this.createItem(ItemType.Apple);
        this.addItem(apple);
        this.addItem(apple1);
        this.addItem(apple2);
        //this.itemHandPanel.leftHand.holdItem(compoundItem);

    }

    update(delta: number): void {
        game.setPixelFont(32);
        this.updateCharacterPosition();
        this.updateItemHighlights();
        this.updateParallax();
        this.sortRoomObjects();
        super.update(delta);
    }

    private sortRoomObjects() {
        const objects = this.roomObjects.children.slice();
        for (let child of objects) {
            this.roomObjects.removeChild(child);
        }
        objects.sort((a, b) => a.y < b.y ? -1 : a.y > b.y ? 1 : 0);
        for (let child of objects) {
            this.roomObjects.addChild(child);
        }
    }

    private *updateLightTask(light: Sprite) {
        while (true) {
            for (let t of Task.sineMotion(5, 0.8, 1)) {
                light.opacity = t;
                yield Wait.frame();
            }
            for (let t of Task.sineMotion(5, 1, 0.8)) {
                light.opacity = t;
                yield Wait.frame();
            }
        }
    }

    private updateCharacterPosition() {
        const controls = [Key.Left, Key.Right, Key.Up, Key.Down];
        const pressed = controls.filter(key => game.input.isKeyPressed(key));
        let direction = Vector2.zero;
        for (let key of pressed) {
            direction = direction.add(this.getVelocityDirection(key));
        }
        direction.x = Math.abs(direction.x) === 1 ? direction.x * 0.75 : direction.x;
        direction.y = Math.abs(direction.y) === 1 ? direction.y * 0.75 : direction.y;
        const playerVelocity = direction.multiply(this.characterSpeed);
        if (game.input.isKeyPressed(Key.Left) && !game.input.isKeyPressed(Key.Right)) {
            this.player.scale.x = -1;
        }
        else if (!game.input.isKeyPressed(Key.Left) && game.input.isKeyPressed(Key.Right)) {
            this.player.scale.x = 1;
        }
        if (playerVelocity.x === 0 && playerVelocity.y === 0) {
            this.player.runIdleAnimation();
        }
        else {
            this.player.runWalkAnimation();
        }
        this.playerPosition = this.transformer
            .moveInCartesian(this.playerPosition, this.playerPosition.add(playerVelocity));
        this.player.position = this.transformer
            .moveInIsometric(this.player.position, this.transformer.toIsometric(this.playerPosition));
        this.playerPosition = this.transformer.toCartesian(this.player.position);
        this.debug.text = `${this.toStringV2(this.playerPosition)} ${this.toStringV2(this.player.position)}`;
        if (this.mousePosition) {
            this.debug.text += ` ${this.toStringV2(this.mousePosition)}  ${this
                .toStringV2(this.transformer.toCartesian(this.mousePosition))}`;
        }
    }

    private updateItemHighlights() {
        for (let item of this.items) {
            item.position = this.transformer.toIsometric(item.cartesianPosition);
            const closeEnough = this.playerPosition.subtract(item.cartesianPosition).length <= 7;
            if (closeEnough) {
                if (this.itemHandPanel.shownItem !== item) {
                    this.itemHandPanel.showItem(item);
                }
                return;
            }
        }
        this.itemHandPanel.showItem(undefined);
    }

    private updateParallax() {
        const leftX = this.transformer.isometricLeft.x;
        const rightX = this.transformer.isometricRight.x;
        const x = (this.player.x - leftX) / (rightX - leftX);
        const bottomY = this.transformer.isometricBottom.y;
        const topY = this.transformer.isometricTop.y;
        const y = (this.player.y - topY) / (bottomY - topY);
        this.cityParallax.offset.set(x, y);
    }

    private getVelocityDirection(key: Key) {
        switch (key) {
            case Key.Left:
                return new Vector2(-0.5, 0.5);
            case Key.Right:
                return new Vector2(0.5, -0.5);
            case Key.Up:
                return new Vector2(-0.5, -0.5);
            case Key.Down:
                return new Vector2(0.5, 0.5);
            default:
                return Vector2.zero;
        }
    }

    createItem(type: ItemType): SimpleItem {
        const item = ItemFactory.createItem(type);
        this.setupItem(item);
        return item;
    }

    setupItem(item: Item) {
        item.onpickup = () => {
            this.removeItem(item);
        };
        item.onput = () => {
            this.addItem(item);
            item.cartesianPosition = this.playerPosition;
            item.position = this.transformer.toIsometric(item.cartesianPosition);
        };
    }

    private addItem(item: Item) {
        this.roomObjects.addChild(item);
        this.items.push(item);
    }

    private removeItem(item: Item) {
        this.roomObjects.removeChild(item);
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    toStringV2(vector: Vector2) {
        return `${vector.x} ${vector.y}`;
    }
}

class ItemFactory {
    private static combos: { pair: { first: ItemType, second: ItemType }, result: ItemType }[] = [
        //{ pair: { first: ItemType.Apple, second: ItemType.Apple }, result: ItemType.Apple }
    ];

    static mergeItems(first: Item, second: Item): SimpleItem | CompoundItem {
        if (first instanceof SimpleItem && second instanceof SimpleItem) {
            for (let combo of this.combos) {
                const match = (first.type === combo.pair.first && second.type === combo.pair.second) ||
                    (second.type === combo.pair.first && first.type === combo.pair.second);
                if (match) {
                    return this.createItem(combo.result);
                }
            }
        }
        return new CompoundItem([first, second]);
    }

    static createItem(type: ItemType): SimpleItem {
        const item = this.getItemObject(type);
        item.type = type;
        return item;
    }

    private static getItemObject(type: ItemType) {
        switch (type) {
            case ItemType.Apple:
                return new SimpleItem(Texture.fromImage(AssetBundle.apple), new Vector2(32, 32), "Apple");
            default:
                throw "Error creating item";
        }
    }
}