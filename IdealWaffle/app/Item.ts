class Item extends Sprite {
    readonly name: string;
    isBeingHeld = false;
    itemView: HandItemView;
    onrelease: () => void;

    constructor(public cartesianPosition: Vector2, texture: Texture, name: string) {
        super();
        this.texture = texture;
        this.pivot = new Vector2(0.5, 1);
        this.size = new Vector2(32, 32);
        this.name = name;
        this.itemView = new HandItemView(this);
    }

    createSprite() {
        const sprite = new Sprite(this.texture);
        sprite.size.set(32, 32);
        return sprite;
    }
}