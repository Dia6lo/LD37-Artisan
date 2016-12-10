class Game extends Application {
    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.skyblue;
        const root = new Room();
        this.root = root;
        this.renderer.imageSmoothing = false;
    }
}
var game;
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};
class PositionTransformer {
    constructor() {
        this.cartesianBounds = new Vector2(100, 100);
        this.obstacles = [
            new Rectangle(0, 20, 12, 35)
        ];
        this.isometricTop = new Vector2(432, 204);
        this.isometricBottom = new Vector2(432, 584);
        this.isometricLeft = new Vector2(48, 394);
        this.isometricRight = new Vector2(816, 394);
        this.isometricSliceHeight = 474;
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.cartesianBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.cartesianBounds.y / 2;
    }
    moveInCartesian(from, to) {
        let result = to.clone();
        result.x = Math.clamp(result.x, 0, this.cartesianBounds.x);
        result.y = Math.clamp(result.y, 0, this.cartesianBounds.y);
        for (let rect of this.obstacles) {
            if (rect.contains(result)) {
                const above = from.y <= rect.top;
                const below = from.y >= rect.bottom;
                const left = from.x <= rect.left;
                const right = from.x >= rect.right;
                if ([above, below, left, right].filter(b => b).length > 1) {
                    return from;
                }
                let intersetingLineStart;
                let intersetingLineEnd;
                const leftTop = new Vector2(rect.left, rect.top);
                const rightTop = new Vector2(rect.right, rect.top);
                const leftBottom = new Vector2(rect.left, rect.bottom);
                const rightBottom = new Vector2(rect.right, rect.bottom);
                if (above) {
                    intersetingLineStart = leftTop;
                    intersetingLineEnd = rightTop;
                }
                else if (below) {
                    intersetingLineStart = leftBottom;
                    intersetingLineEnd = rightBottom;
                }
                else if (right) {
                    intersetingLineStart = rightTop;
                    intersetingLineEnd = rightBottom;
                }
                else if (left) {
                    intersetingLineStart = leftTop;
                    intersetingLineEnd = leftBottom;
                }
                else {
                    throw "Error getting intersecting line";
                }
                const intersection = this.getIntersection(from, result, intersetingLineStart, intersetingLineEnd);
                if (intersection) {
                    result = intersection;
                }
                if (above) {
                    result.y -= 0.05;
                }
                else if (below) {
                    result.y += 0.05;
                }
                else if (right) {
                    result.x += 0.05;
                }
                else if (left) {
                    result.x -= 0.05;
                }
            }
        }
        return result;
    }
    getIntersection(v1, v2, v3, v4) {
        const x1 = v1.x;
        const y1 = v1.y;
        const x2 = v2.x;
        const y2 = v2.y;
        const x3 = v3.x;
        const y3 = v3.y;
        const x4 = v4.x;
        const y4 = v4.y;
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) {
            return undefined;
        }
        const x = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        const y = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        return new Vector2(x / denominator, y / denominator);
    }
    moveInIsometric(from, to) {
        const result = to.clone();
        result.y = Math.clamp(result.y, this.isometricTop.y, this.isometricSliceHeight);
        return result;
    }
    isLeft(a, b, c) {
        return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
    }
    toIsometric(position) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return new Vector2(x, y).add(this.isometricTop);
    }
    toCartesian(position) {
        const noOffset = position.subtract(this.isometricTop);
        const x = (noOffset.x / this.xModifier + noOffset.y / this.yModifier) / 2;
        const y = (noOffset.y / this.yModifier - noOffset.x / this.xModifier) / 2;
        return new Vector2(x, y);
    }
}
class Room extends Widget {
    constructor() {
        super();
        this.room = Sprite.fromImage("assets/Room.png");
        this.character = Sprite.fromImage("assets/Character.png");
        this.transformer = new PositionTransformer();
        this.characterPosition = new Vector2(0, 0);
        this.characterVelocity = Vector2.zero;
        this.characterSpeed = 1;
        this.debug = new Label();
        this.itemLayer = new Widget();
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
        const apple = this.createItem(0);
        this.itemLayer.addChild(apple);
    }
    update(delta) {
        this.updateCharacterPosition();
        super.update(delta);
    }
    updateCharacterPosition() {
        const controls = [47, 48, 45, 46];
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
    getVelocityDirection(key) {
        switch (key) {
            case 47:
                return new Vector2(-0.5, 0.5);
            case 48:
                return new Vector2(0.5, -0.5);
            case 45:
                return new Vector2(-0.5, -0.5);
            case 46:
                return new Vector2(0.5, 0.5);
            default:
                return Vector2.zero;
        }
    }
    createItem(type) {
        switch (type) {
            case 0:
                return new Item(new Vector2(5, 10), this.transformer, Texture.fromImage("assets/Apple.png"));
            default:
                throw "Error creating item";
        }
    }
    toStringV2(vector) {
        return `${vector.x} ${vector.y}`;
    }
}
class Item extends Sprite {
    constructor(cartesianPosition, transformer, texture) {
        super();
        this.cartesianPosition = cartesianPosition;
        this.transformer = transformer;
        this.texture = texture;
        this.pivot = new Vector2(0.5, 1);
        this.size = new Vector2(32, 32);
    }
    update(delta) {
        this.position = this.transformer.toIsometric(this.cartesianPosition);
    }
}
//# sourceMappingURL=app.js.map