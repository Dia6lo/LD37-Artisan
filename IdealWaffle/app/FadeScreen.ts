class FadeScreen extends Widget {
    private readonly label;
    text = "Loading";
    private readonly labelGroup = new Widget();
    private readonly startLabelGroup = new Widget();
    private readonly centerLabelGroup = new Widget();
    private readonly endLabelGroup = new Widget();

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

    setupEnding(items: Item[]) {
        const center = this.rendererSize.divide(2);
        this.removeChild(this.label);
        let f = this.format;

        let label = this.createLabel("Today the legend was born.");
        this.startLabelGroup.addChild(label);

        let start = Vector2.zero;
        label = this.createLabel("Evil can't hide from his");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[2].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel("It can't run away from the speed of his");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[3].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel("And any mistakes will be fixed by his");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[5].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 72;

        label = this.createLabel("Magma flows in his veins by the power of the");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[0].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel("He solves all main problems of humanity with his brilliant");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[1].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel("And he brings justice by his legendary");
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel(items[4].name);
        this.centerLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;

        start = Vector2.zero;
        label = this.createLabel("I will make dreams come true.");
        this.endLabelGroup.addChild(label);
        label.position = start.clone();
        start.y += 36;
        label = this.createLabel("In a city that should not exist.");
        this.endLabelGroup.addChild(label);
        label.position = start.clone();

        this.labelGroup.addChild(this.startLabelGroup);
        this.labelGroup.addChild(this.centerLabelGroup);
        this.centerLabelGroup.y = center.y;
        this.centerLabelGroup.opacity = 0;
        this.labelGroup.addChild(this.endLabelGroup);
        this.endLabelGroup.y = center.y + 725;
        this.endLabelGroup.opacity = 0;
        this.labelGroup.position = center.clone();
        this.addChild(this.labelGroup);
        this.tasks.add(this.moveEndingTask());
    }

    private format(text: string, data: string) {
        return text.replace("{0}", data);
    }

    private *moveEndingTask() {
        const path = 1025;
        const start = this.labelGroup.y;
        yield Wait.seconds(2);
        this.centerLabelGroup.opacity = 1;
        this.endLabelGroup.opacity = 1;
        while (true) {
            if (this.labelGroup.y > start - path) {
                this.labelGroup.y -= 0.5;
            }
            else {
                trackEvent("outro_end");
                appInsights.flush();
                break;
            }
            yield Wait.frame();
        }
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
        for (let parent of this.labelGroup.children) {
            for (let child of parent.children) {
                if (child instanceof Label) {
                    child.width = renderer.measureText(child.text);
                    child.height = 32;
                }
            }
        }
        super.render(renderer);
        renderer.restore();
    }
}