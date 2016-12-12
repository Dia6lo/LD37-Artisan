class Room extends Widget {
    private room = Sprite.fromImage(AssetBundle.room);
    private player = new Player();
    private transformer = new PositionTransformer();
    private playerPosition = new Vector2(50, 50);
    private characterSpeed = 0.30;
    private mousePosition: Vector2;
    private debug = new Label();
    private cityParallax = new CityParallax();
    private itemHandPanel = new ItemHandPanel();
    private items: Item[] = [];
    private roomObjects = new Widget();

    constructor() {
        super();
        this.cityParallax.position = new Vector2(304, 76);
        this.addChild(this.cityParallax);
        this.room.size = new Vector2(886, 554);
        this.player.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        const light = Sprite.fromImage(AssetBundle.light);
        light.size = new Vector2(440, 440);
        light.pivot = Vector2.half;
        light.position = new Vector2(446, 132);
        light.opacity = 0.6;
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

        //this.itemHandPanel.showItem(apple);
        this.roomObjects.addChild(apple);
        this.items.push(apple);
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
            const random = Math.random();
            if (random > 0.6) {
                for (let t of Task.sineMotion(3, 0.6, 1)) {
                    light.opacity = t;
                    yield Wait.frame();
                }
                for (let t of Task.sineMotion(3, 1, 0.6)) {
                    light.opacity = t;
                    yield Wait.frame();
                }
            }
            yield Wait.seconds(1);
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
            if (!item.isActive) continue;
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

    createItem(type: ItemType): Item {
        const item = this.getItemObject(type);
        item.onrelease = () => {
            item.cartesianPosition = this.playerPosition;
            item.position = this.transformer.toIsometric(item.cartesianPosition);
        };
        return item;
    }

    private getItemObject(type: ItemType) {
        switch (type) {
            case ItemType.Apple:
                return new Item(new Vector2(50, 50), Texture.fromImage(AssetBundle.apple), "Apple");
            default:
                throw "Error creating item";
        }
    }

    toStringV2(vector: Vector2) {
        return `${vector.x} ${vector.y}`;
    }
}