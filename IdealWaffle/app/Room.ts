class Room extends Widget {
    private room = Sprite.fromImage(AssetBundle.room);
    private player = Sprite.fromImage(AssetBundle.player);
    private transformer = new PositionTransformer();
    private playerPosition = new Vector2(50, 50);
    private characterSpeed = 0.5;
    private mousePosition: Vector2;
    private debug = new Label();
    private itemLayer = new Widget();
    private cityParallax = new CityParallax();
    private rightHand = new ItemHand(false, "x");
    private leftHand = new ItemHand(true, "z");

    constructor() {
        super();
        this.cityParallax.position = new Vector2(304, 76);
        this.addChild(this.cityParallax);
        this.room.size = new Vector2(886, 554);
        this.player.size = new Vector2(40, 130);
        this.player.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        const light = Sprite.fromImage(AssetBundle.light);
        light.size = new Vector2(440, 440);
        light.pivot = Vector2.half;
        light.position = new Vector2(436, 128);
        light.opacity = 0.6;
        this.addChild(light);
        this.tasks.add(this.updateLightTask(light));
        this.addChild(this.itemLayer);
        this.addChild(this.player);
        this.rightHand.position.set(720, 120);
        this.addChild(this.rightHand);
        this.leftHand.position.set(250, 120);
        this.addChild(this.leftHand);
        document.body.onmousemove = ev => {
            this.mousePosition = new Vector2(ev.x - game.renderer.view.offsetLeft, ev.y - game.renderer.view.offsetTop);
        };
        this.debug.fontColor = Color.white;
        this.addChild(this.debug);
        const apple = this.createItem(ItemType.Apple);
        this.itemLayer.addChild(apple);
    }

    update(delta: number): void {
        this.updateCharacterPosition();
        this.updateItemHighlights();
        this.updateParallax();
        super.update(delta);
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
        for (let child of this.itemLayer.children) {
            const item = child as Item;
            item.highlighted = this.playerPosition.subtract(item.cartesianPosition).length <= 5;
        }
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
        switch (type) {
            case ItemType.Apple:
                return new Item(new Vector2(25, 25), this.transformer, Texture.fromImage(AssetBundle.apple), "Apple");
            default:
                throw "Error creating item";
        }
    }

    toStringV2(vector: Vector2) {
        return `${vector.x} ${vector.y}`;
    }
}

const enum ItemType {
    Apple
}

class Item extends Sprite {
    highlighted = false;
    private tooltip = new Label();

    constructor(public cartesianPosition: Vector2, private readonly transformer: PositionTransformer, texture: Texture, name: string) {
        super();
        this.texture = texture;
        this.pivot = new Vector2(0.5, 1);
        this.size = new Vector2(32, 32);
        this.tooltip.text = name;
        this.tooltip.pivot = new Vector2(0.5, 1);
        this.tooltip.horizontalTextAlignment = TextAlignment.Center;
        this.tooltip.verticalTextAlignment = TextAlignment.Center;
    }

    update(delta: number): void {
        this.position = this.transformer.toIsometric(this.cartesianPosition);
    }

    render(renderer: Renderer): void {
        renderer.save();
        if (this.highlighted) {
            const fontSize = 32;
            game.setPixelFont(fontSize);
            const measure = new Vector2(renderer.measureText(this.tooltip.text), fontSize);
            this.tooltip.size = measure.add(new Vector2(10));
            this.tooltip.position = new Vector2(this.width / 2, -5);
            renderer.save();
            renderer.vectorGraphics
                .strokeStyle(2)
                .fillStyle(Color.wheat)
                .drawRoundedRect(this.tooltip.x - this.tooltip.width / 2,
                this.tooltip.y - this.tooltip.height * 0.9, this.tooltip.width, this.tooltip.height * 1.2, 5);
            renderer.restore();
            renderer.render(this.tooltip);
            renderer.context.globalCompositeOperation = "lighter";
        }
        super.render(renderer);
        renderer.restore();
    }
}