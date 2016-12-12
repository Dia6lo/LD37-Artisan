class DisplayableObject extends Widget {
    onpickup: () => void = () => { };
    onput: () => void = () => { };
    oninteract: (item?: Item) => boolean = () => false;
    displayView: Widget;
    pickable = true;
}

class SpecialSpot extends DisplayableObject {
    pickable = false;

    constructor(texture: Texture, tooltip: string) {
        super();
        const sprite = new Sprite(texture);
        sprite.size.set(32, 32);
        sprite.pivot = Vector2.half;
        this.displayView = new PanelObjectView(sprite, tooltip, false);
    }
}

interface Item extends DisplayableObject {
    readonly name: string;
    createSprite(): Widget;
    cartesianPosition: Vector2;
}

class SimpleItem extends DisplayableObject implements Item {
    name: string;
    protected image = new Sprite();
    cartesianPosition = new Vector2(50, 50);
    type: ItemType;

    constructor(texture: Texture, name: string) {
        super();
        this.image.texture = texture;
        this.image.pivot = new Vector2(0.5, 1);
        this.image.size = new Vector2(32, 32);
        this.addChild(this.image);
        this.name = name;
        this.displayView = new HandItemView(this);
    }

    createSprite(): Widget {
        const sprite = new Sprite(this.image.texture);
        sprite.size = this.image.size.clone();
        return sprite;
    }
}

class CompoundItem extends DisplayableObject implements Item {
    name: string;
    cartesianPosition = new Vector2(50, 50);

    constructor(public parts: Item[]) {
        super();
        this.name = "";
        for (let item of parts) {
            this.name += `${item.name}-`;
        }
        this.name = this.name.substr(0, this.name.length - 1);
        const sprite = this.createSprite();
        sprite.pivot = Vector2.half;
        this.addChild(sprite);
        this.displayView = new HandItemView(this);
    }

    createSprite() : Widget {
        const compound = new Widget();
        let width = 0;
        let height = 0;
        for (let item of this.parts) {
            const sprite = item.createSprite();
            sprite.x = width === 0 ? width : width - 5;
            compound.addChild(sprite);
            width += sprite.width - 5;
            if (sprite.height > height) {
                height = sprite.height;
            }
        }
        compound.size.set(width, height);
        return compound;
    }
}