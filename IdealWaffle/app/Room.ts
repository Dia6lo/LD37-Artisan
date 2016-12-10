class RoomBounds {
    orthogonalBounds = new Vector2(100, 100);
    isometricTop = new Vector2(440, 220);
    isometricBottom = new Vector2(440, 640);
    isometricLeft = new Vector2(50, 430);
    isometricRight = new Vector2(830, 430);
    xModifier: number;
    yModifier: number;

    constructor() {
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.orthogonalBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.orthogonalBounds.y / 2;
    }

    toIsometric(position: Vector2) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return  new Vector2(x, y).add(this.isometricTop);
    }
}

class Room extends Widget {
    private room = Sprite.fromImage("assets/Room.png");
    private character = Sprite.fromImage("assets/Character.png");
    private floorBounds = new Vector2(100, 100);
    private characterPosition = new Vector2(0, 0);
    private characterVelocity = Vector2.zero;
    private characterSpeed = 1;
    private debug = new Label();
    private bounds = new RoomBounds();

    constructor() {
        super();
        this.room.size = new Vector2(900, 600);
        this.character.size = new Vector2(23, 26);
        this.character.position = new Vector2(450, 220);
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
        this.characterVelocity = direction.multiply(this.characterSpeed);
        this.characterPosition.x = Math.clamp(this.characterPosition.x + this.characterVelocity.x, 0, this.floorBounds.x);
        this.characterPosition.y = Math.clamp(this.characterPosition.y + this.characterVelocity.y, 0, this.floorBounds.y);
        this.character.position = this.bounds.toIsometric(this.characterPosition);
        this.debug.text = `${this.toStringV2(this.characterVelocity)} ${this.toStringV2(this.characterPosition)} ${this.toStringV2(this.character.position)}`;
    }

    private getVelocityDirection(key: Key) {
        switch (key) {
            case Key.Left:
                return new Vector2(-1, 0);
            case Key.Right:
                return new Vector2(1, 0);
            case Key.Up:
                return new Vector2(0, -1);
            case Key.Down:
                return new Vector2(0, 1);
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