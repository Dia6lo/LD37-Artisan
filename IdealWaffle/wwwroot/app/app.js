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
class RoomBounds {
    constructor() {
        this.orthogonalBounds = new Vector2(100, 100);
        this.isometricTop = new Vector2(432, 204);
        this.isometricBottom = new Vector2(432, 584);
        this.isometricLeft = new Vector2(48, 394);
        this.isometricRight = new Vector2(816, 394);
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.orthogonalBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.orthogonalBounds.y / 2;
    }
    toIsometric(position) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return new Vector2(x, y).add(this.isometricTop);
    }
}
class Room extends Widget {
    constructor() {
        super();
        this.room = Sprite.fromImage("assets/Room.png");
        this.character = Sprite.fromImage("assets/Character.png");
        this.floorBounds = new Vector2(100, 100);
        this.characterPosition = new Vector2(0, 0);
        this.characterVelocity = Vector2.zero;
        this.characterSpeed = 1;
        this.debug = new Label();
        this.bounds = new RoomBounds();
        this.room.size = new Vector2(886, 554);
        this.character.size = new Vector2(23, 26);
        this.character.position = new Vector2(450, 220);
        this.character.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        this.addChild(this.character);
        this.debug.position = new Vector2(100, 100);
    }
    update(delta) {
        const controls = [47, 48, 45, 46];
        const pressed = controls.filter(key => game.input.isKeyPressed(key));
        let direction = Vector2.zero;
        for (let key of pressed) {
            direction = direction.add(this.getVelocityDirection(key));
        }
        direction.x = Math.abs(direction.x) === 1 ? direction.x * 0.75 : direction.x;
        direction.y = Math.abs(direction.y) === 1 ? direction.y * 0.75 : direction.y;
        this.characterVelocity = direction.multiply(this.characterSpeed);
        this.characterPosition.x = Math.clamp(this.characterPosition.x + this.characterVelocity.x, 0, this.floorBounds.x);
        this.characterPosition.y = Math.clamp(this.characterPosition.y + this.characterVelocity.y, 0, this.floorBounds.y);
        this.character.position = this.bounds.toIsometric(this.characterPosition);
        this.debug.text = `${this.toStringV2(this.characterVelocity)} ${this.toStringV2(this.characterPosition)} ${this.toStringV2(this.character.position)}`;
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
    toStringV2(vector) {
        return `${vector.x} ${vector.y}`;
    }
    twoDToIso(pt) {
        const tempPt = new Vector2(0, 0);
        tempPt.x = pt.x - pt.y;
        tempPt.y = (pt.x + pt.y) / 2;
        return (tempPt);
    }
}
//# sourceMappingURL=app.js.map