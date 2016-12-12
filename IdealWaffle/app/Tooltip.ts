class Tooltip extends GuiFrame {
    private readonly nameLabel = new Label();

    constructor(text: string, color = Game.neon) {
        super();
        this.nameLabel.text = text;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = color;
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
    }

    set text(value: string) {
        this.nameLabel.text = value;
    }

    beforeRender(renderer: Renderer): void {
        super.beforeRender(renderer);
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        const measure = new Vector2(renderer.measureText(this.nameLabel.text), fontSize);
        this.size = measure.add(new Vector2(15, 0));
        this.nameLabel.position = this.size.divide(2).subtract(new Vector2(0, 10));
        renderer.restore();
    }

    render(renderer: Renderer): void {
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        super.render(renderer);
        renderer.restore();
    }
}

class MessageBox extends GuiFrame {
    private readonly fontSize = 32;

    constructor(nickname: string, line1: string, line2: string, line3: string) {
        super();
        this.size = new Vector2(780, 170);
        this.createLabel(line1, 0);
        this.createLabel(line2, 1);
        this.createLabel(line3, 2);
    }

    private createLabel(text: string, lineIndex: number) {
        const label = new Label(text);
        label.y = lineIndex * (this.fontSize + 5) + 20;
        label.x = 35;
        label.fontColor = Game.neon;
        this.addChild(label);
    }

    render(renderer: Renderer): void {
        renderer.save();
        game.setPixelFont(this.fontSize);
        super.render(renderer);
        renderer.restore();
    }
}

class QuestMessageBox extends MessageBox {
    static weapon: Item;
    private readonly nickName: Tooltip;
    private readonly faceFrame: GuiFrame;

    constructor(quest: Quest, state: QuestState) {
        const f = QuestMessageBox.format;
        if (state === QuestState.Briefing || state === QuestState.Craft) {
            super(quest.nickname, f(quest.briefing[0]), f(quest.briefing[1]), f(quest.briefing[2]));
        }
        else {
            super(quest.nickname, f(quest.debriefing[0]), f(quest.debriefing[1]), f(quest.debriefing[2]));
        }
        this.faceFrame = new GuiFrame();
        this.faceFrame.size.set(100, 118);
        this.faceFrame.position.set(this.width - this.faceFrame.width - 25, -this.faceFrame.height + 5);
        this.addChild(this.faceFrame);
        const face = Sprite.fromImage(quest.face);
        face.size = this.faceFrame.size;
        face.position = this.faceFrame.position;
        this.addChild(face);
        this.nickName = new Tooltip(quest.nickname, Color.white);
        this.addChild(this.nickName);
    }

    update(delta: number): void {
        super.update(delta);
        this.nickName.position = this.faceFrame.position.add(this.nickName.size.divide(2));
        this.nickName.y += this.faceFrame.height - 15;
        this.nickName.x += (this.faceFrame.width - this.nickName.width) / 2;
    }

    private static format(text: string) {
        return QuestMessageBox.weapon ? text.replace("{0}", QuestMessageBox.weapon!.name).substr(0, 55) : text;
    }
}