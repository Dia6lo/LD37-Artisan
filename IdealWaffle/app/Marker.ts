class Marker extends Sprite {
    start: Vector2;

    constructor() {
        super(Texture.fromImage(AssetBundle.marker));
        this.pivot = Vector2.half;
        this.size.set(26, 22);
        this.tasks.add(this.moveTask());
    }

    private *moveTask() {
        const min = 0;
        const max = 5;
        while (true) {
            for (let t of Task.linearMotion(0.5, min, max)) {
                this.position = this.start.clone();
                this.position.y += t;
                yield Wait.frame();
            }
            for (let t of Task.linearMotion(0.5, max, min)) {
                this.position = this.start.clone();
                this.position.y += t;
                yield Wait.frame();
            }
        }
    }

    enable() {
        this.opacity = 1;
    }

    disable() {
        this.opacity = 0;
    }
}