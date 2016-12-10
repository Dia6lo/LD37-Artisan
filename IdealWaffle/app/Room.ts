class Room extends Widget {
    private room = Sprite.fromImage("assets/Room.png");
    private character = Sprite.fromImage("assets/Character.png");
    private transformer = new PositionTransformer();
    private characterPosition = new Vector2(0, 0);
    private characterVelocity = Vector2.zero;
    private characterSpeed = 1;
    private mousePosition: Vector2;
    private debug = new Label();
    private itemLayer = new Widget();

    constructor() {
        super();
        this.room.size = new Vector2(886, 554);
        this.character.size = new Vector2(23, 26);
        this.character.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        this.addChild(this.itemLayer);
        this.addChild(this.character);
        document.body.onmousemove = ev => {
            this.mousePosition = new Vector2(ev.x - game.renderer.view.offsetLeft, ev.y - game.renderer.view.offsetTop);
        };
        this.addChild(this.debug);
        const apple = this.createItem(ItemType.Apple);
        this.itemLayer.addChild(apple);
    }

    update(delta: number): void {
        this.updateCharacterPosition();
        super.update(delta);
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
        this.characterVelocity = direction.multiply(this.characterSpeed);
        this.characterPosition = this.transformer
            .moveInCartesian(this.characterPosition, this.characterPosition.add(this.characterVelocity));
        this.character.position = this.transformer
            .moveInIsometric(this.character.position, this.transformer.toIsometric(this.characterPosition));
        this.characterPosition = this.transformer.toCartesian(this.character.position);
        this.debug.text = `${this.toStringV2(this.characterPosition)} ${this.toStringV2(this.character.position)}`;
        if (this.mousePosition) {
            this.debug.text += ` ${this.toStringV2(this.mousePosition)}  ${this
                .toStringV2(this.transformer.toCartesian(this.mousePosition))}`;
        }
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
                return new Item(new Vector2(5, 10), this.transformer, Texture.fromImage("assets/Apple.png"));
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
    constructor(public cartesianPosition: Vector2, private readonly transformer: PositionTransformer, texture: Texture) {
        super();
        this.texture = texture;
        this.pivot = new Vector2(0.5, 1);
        this.size = new Vector2(32, 32);
    }

    update(delta: number): void {
        this.position = this.transformer.toIsometric(this.cartesianPosition);
    }
}