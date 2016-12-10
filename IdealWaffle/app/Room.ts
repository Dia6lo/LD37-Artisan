class RoomBounds {
    cartesianBounds = new Vector2(100, 100);

    obstacles = [
        new Rectangle(0, 20, 12, 35)
    ];

    isometricTop = new Vector2(432, 204);
    isometricBottom = new Vector2(432, 584);
    isometricLeft = new Vector2(48, 394);
    isometricRight = new Vector2(816, 394);
    isometricSliceHeight = 474;

    xModifier: number;
    yModifier: number;

    constructor() {
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.cartesianBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.cartesianBounds.y / 2;
    }

    moveInCartesian(from: Vector2, to: Vector2) {
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
                let intersetingLineStart: Vector2;
                let intersetingLineEnd: Vector2;
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

    private getIntersection(v1: Vector2, v2: Vector2, v3: Vector2, v4: Vector2): Vector2 | undefined {
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

    moveInIsometric(from: Vector2, to: Vector2) {
        const result = to.clone();
        result.y = Math.clamp(result.y, this.isometricTop.y, this.isometricSliceHeight);
        return result;
    }

    isLeft(a: Vector2, b: Vector2, c: Vector2){
        return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
    }

    toIsometric(position: Vector2) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return new Vector2(x, y).add(this.isometricTop);
    }

    toCartesian(position: Vector2) {
        const noOffset = position.subtract(this.isometricTop);
        const x = (noOffset.x / this.xModifier + noOffset.y / this.yModifier) / 2;
        const y = (noOffset.y / this.yModifier - noOffset.x / this.xModifier) / 2;
        return new Vector2(x, y);
    }
}

class Room extends Widget {
    private room = Sprite.fromImage("assets/Room.png");
    private character = Sprite.fromImage("assets/Character.png");
    private bounds = new RoomBounds();
    private characterPosition = new Vector2(0, 0);
    private characterVelocity = Vector2.zero;
    private characterSpeed = 1;
    private debug = new Label();

    constructor() {
        super();
        this.room.size = new Vector2(886, 554);
        this.character.size = new Vector2(23, 26);
        this.character.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        this.addChild(this.character);
        this.debug.position = new Vector2(100, 100);
        //this.addChild(this.debug);
    }

    update(delta: number): void {
        const controls = [Key.Left, Key.Right, Key.Up, Key.Down];
        const pressed = controls.filter(key => game.input.isKeyPressed(key));
        let direction = Vector2.zero;
        for (let key of pressed) {
            direction = direction.add(this.getVelocityDirection(key));
        }
        direction.x = Math.abs(direction.x) === 1 ? direction.x * 0.75 : direction.x;
        direction.y = Math.abs(direction.y) === 1 ? direction.y * 0.75 : direction.y;
        this.characterVelocity = direction.multiply(this.characterSpeed);
        this.characterPosition = this.bounds.moveInCartesian(this.characterPosition, this.characterPosition.add(this.characterVelocity));
        this.character.position = this.bounds.moveInIsometric(this.character.position, this.bounds.toIsometric(this.characterPosition));
        this.characterPosition = this.bounds.toCartesian(this.character.position);
        this.debug.text = `${this.toStringV2(this.characterPosition)} ${this.toStringV2(this.character.position)}`;
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

    toStringV2(vector: Vector2) {
        return `${vector.x} ${vector.y}`;
    }

    twoDToIso(pt: Vector2): Vector2 {
        const tempPt = new Vector2(0, 0);
        tempPt.x = pt.x - pt.y;
        tempPt.y = (pt.x + pt.y) / 2;
        return (tempPt);
    }
}