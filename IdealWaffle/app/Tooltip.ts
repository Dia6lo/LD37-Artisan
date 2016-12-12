class Tooltip extends GuiFrame {
    private readonly nameLabel = new Label();

    constructor(text: string) {
        super();
        this.nameLabel.text = text;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = Game.neon;
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
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

    constructor(quest: Quest, state: QuestState, item?: Item) {
        const f = QuestMessageBox.format;
        if (state === QuestState.Debriefing || state === QuestState.Sleep) {
            super(quest.nickname, f(quest.debriefing[0]), f(quest.debriefing[1]), f(quest.debriefing[2]));
        }
        else {
            super(quest.nickname, f(quest.briefing[0]), f(quest.briefing[1]), f(quest.briefing[2]));
        }
    }

    private static format(text: string) {
        return QuestMessageBox.weapon ? text.replace("{0}", QuestMessageBox.weapon!.name).substr(0, 55) : text;
    }
}