class LoadingScreen extends Widget {
    private readonly label = new Label("Loading");

    constructor() {
        super();
        this.label.horizontalTextAlignment = TextAlignment.Center;
        this.label.verticalTextAlignment = TextAlignment.Center;
        this.addChild(this.label);
        this.tasks.add(this.updateLabelTask());
    }

    private *updateLabelTask() {
        while (true) {
            this.label.text = "Loading";
            yield Wait.seconds(0.5);
            this.label.text = "Loading.";
            yield Wait.seconds(0.5);
            this.label.text = "Loading..";
            yield Wait.seconds(0.5);
            this.label.text = "Loading...";
            yield Wait.seconds(0.5);
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