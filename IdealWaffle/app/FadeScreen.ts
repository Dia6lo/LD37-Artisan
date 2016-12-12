class FadeScreen extends Widget {
    private readonly label = new Label();
    text = "Loading";
    rendererHeight: number;

    constructor(height: number) {
        super();
        this.rendererHeight = height;
        this.label.fontColor = Color.white;
        this.label.horizontalTextAlignment = TextAlignment.Center;
        this.label.verticalTextAlignment = TextAlignment.Center;
        this.addChild(this.label);
        this.tasks.add(this.updateLabelTask());
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

    fadeIn() {
        this.tasks.add(this.moveTask(-this.rendererHeight, 0));
    }

    fadeOut() {
        this.tasks.add(this.moveTask(0, -this.rendererHeight));
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
        super.render(renderer);
    }
}