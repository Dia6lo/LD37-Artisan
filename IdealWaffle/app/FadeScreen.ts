class FadeScreen extends Widget {
    private readonly label;
    text = "Loading";

    constructor(private readonly rendererSize: Vector2) {
        super();
        this.label = this.createLabel();
        this.label.position = rendererSize.divide(2);
        this.addChild(this.label);
        this.label.tasks.add(this.updateLabelTask());
    }

    private *updateLabelTask() {
        while (true) {
            this.label.text = `${this.text}`;
            yield Wait.seconds(0.5);
            this.label.text = `${this.text}.`;
            yield Wait.seconds(0.5);
            this.label.text = `${this.text}..`;
            yield Wait.seconds(0.5);
            this.label.text = `${this.text}...`;
            yield Wait.seconds(0.5);
        }
    }

    setupEnding() {
        const center = this.rendererSize.divide(2);
        this.removeChild(this.label);
        const textLabel = this.createLabel("I will make dreams come true. In a city that should not exist.");
        textLabel.position = center.subtract(new Vector2(0, 18));
        this.addChild(textLabel);
        const gameOverLabel = this.createLabel("Game over?");
        gameOverLabel.position = center.add(new Vector2(0, 18));
        this.addChild(gameOverLabel);
    }

    private createLabel(text?: string) {
        const label = new Label(text);
        label.fontColor = Color.white;
        label.horizontalTextAlignment = TextAlignment.Center;
        label.verticalTextAlignment = TextAlignment.Center;
        label.pivot = Vector2.half;
        return label;
    }

    fadeIn() {
        this.tasks.add(this.moveTask(-this.rendererSize.y, 0));
    }

    fadeOut() {
        this.tasks.add(this.moveTask(0, -this.rendererSize.y));
    }

    private *moveTask(from: number, to: number) {
        for (let t of Task.linearMotion(0.5, from, to)) {
            this.y = t;
            yield Wait.frame();
        }
    }

    render(renderer: Renderer): void {
        const size = renderer.size;
        renderer.save();
        renderer.vectorGraphics
            .fillStyle(Color.black)
            .drawRect(0, 0, size.x, size.y);
        renderer.restore();
        this.label.size = size;
        renderer.save();
        game.setPixelFont(32);
        for (let child of this.children) {
            if (child instanceof Label) {
                child.width = renderer.measureText(child.text);
                child.height = 32;
            }
        }
        super.render(renderer);
        renderer.restore();
    }
}