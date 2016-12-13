class Room extends Widget {
    private room = Sprite.fromImage(AssetBundle.room);
    private player = new Player();
    private transformer = new PositionTransformer();
    private playerPosition = new Vector2(44, 65);
    private characterSpeed = 0.3;
    private mousePosition: Vector2;
    private debug = new Label();
    private cityParallax = new CityParallax();
    private itemHandPanel: ItemHandPanel;
    private items: Item[] = [];
    private roomObjects = new Widget();
    private tvMarker = new Marker();
    private tvSpot = new SpecialSpot(Texture.fromImage(AssetBundle.watchTv), "Read last message");
    private bedMarker = new Marker();
    private bedSpot = new SpecialSpot(Texture.fromImage(AssetBundle.sleep), "Go to bed");
    private postMarker = new Marker();
    private postSpot = new SpecialSpot(Texture.fromImage(AssetBundle.send), "Send requested item");
    private carpetMarker = new Marker();
    private carpetSpot = new SpecialSpot(Texture.fromImage(AssetBundle.piece), "Pull carpet");
    private assembleSpot = new SpecialSpot(Texture.fromImage(AssetBundle.craft), "Setup Power Source");
    private quests = Quest.createStory();
    private currentQuestId = 0;
    private questState = QuestState.Briefing;
    private movementBlocked = false;
    private tvOpened = false;
    private tvMessage: MessageBox;
    private messageLayer = new Widget();
    private readonly fadeScreen = new FadeScreen(new Vector2(886, 554));
    private questItems: Item[] = [];
    private tips: string[] = [];
    private tip = new Tooltip("");
    private news: string[] = [];
    private newsLine = new Label();
    private finalItems: Item[] = [];
    private assemblingStage = 0;
    private pipe: Item;
    private lighter: Item;

    constructor() {
        super();
        this.itemHandPanel = new ItemHandPanel(this);
        this.cityParallax.position = new Vector2(304, 76);
        this.addChild(this.cityParallax);
        this.room.size = new Vector2(886, 554);
        this.player.pivot = new Vector2(0.5, 1);
        this.addChild(this.room);
        const light = Sprite.fromImage(AssetBundle.light);
        light.size = new Vector2(440, 440);
        light.pivot = Vector2.half;
        light.position = new Vector2(446, 132);
        light.opacity = 0.8;
        this.tasks.add(this.updateLightTask(light));
        this.addChild(this.roomObjects);
        this.roomObjects.addChild(this.player);
        this.addChild(light);
        this.itemHandPanel.position.set(485, 120);
        this.addChild(this.itemHandPanel);
        document.body.onmousemove = ev => {
            this.mousePosition = new Vector2(ev.x - game.renderer.view.offsetLeft, ev.y - game.renderer.view.offsetTop);
        };
        this.debug.fontColor = Color.white;
        //this.addChild(this.debug);
        this.newsLine.fontColor = Color.fromComponents(41, 196, 191);
        this.newsLine.position.set(900, 505);
        this.addChild(this.newsLine);
        this.setupMarker(this.tvMarker, 268, 145);
        this.tvSpot.oninteract = item => this.onTvSpotInteract(item);
        this.setupMarker(this.bedMarker, 165, 305);
        this.bedMarker.disable();
        this.bedSpot.oninteract = item => this.onBedSpotInteract(item);
        this.setupMarker(this.postMarker, 725, 320);
        this.postMarker.disable();
        this.postSpot.oninteract = item => this.onPostSpotInteract(item);
        this.setupMarker(this.carpetMarker, 325, 350);
        this.carpetMarker.disable();
        this.carpetSpot.oninteract = item => this.onCarpetSpotInteract(item);
        this.assembleSpot.oninteract = item => this.onAssembleSpotInteract(item);
        this.spawnQuestItems();
        for (let item of this.items) {
            const simpleItem = item as SimpleItem;
            if (simpleItem.type === ItemType.Pipe) {
                this.pipe = item;
            }
            if (simpleItem.type === ItemType.Lighter) {
                this.lighter = item;
            }
        }
        this.addChild(this.messageLayer);
        this.addChild(this.fadeScreen);
        assets.loaded.subscribe(this.onAssetsLoaded, this);
        this.itemHandPanel.frozen = true;
        this.tip.pivot = Vector2.half;
        this.tip.position.set(450, 650);
        this.addChild(this.tip);
        this.tasks.add(this.showTipTask());
        this.tasks.add(this.showNewsTask());
        game.audio.play("assets/ArtisanFixed.mp3", true, 0.75);
    }

    private onCarpetSpotInteract(item?: Item) {
        this.room.texture = Texture.fromImage(AssetBundle.room2);
        this.questState = QuestState.Assembling;
        return false;
    }

    private onAssembleSpotInteract(item?: Item) {
        if (item) {
            this.finalItems.push(item);
            this.assemblingStage++;
            let text = "";
            switch (this.assemblingStage) {
                case 1:
                    text = "Insert Computing element";
                    break;
                case 2:
                    text = "Insert Vision system";
                    break;
                case 3:
                    text = "Insert Movement device";
                    break;
                case 4:
                    text = "Insert Weapon";
                    break;
                case 5:
                    text = "Add Miracle Component";
                    break;
                default: {
                    this.itemHandPanel.frozen = true;
                    this.fadeScreen.setupEnding(this.finalItems);
                    this.fadeScreen.fadeIn();
                }
            }
            this.assembleSpot.text = text;
            return true;
        }
        this.addTip("I need something to insert here.");
        return false;
    }

    addTip(tip: string) {
        if (this.tips.filter(t => t === tip).length === 0) {
            this.tips.unshift(tip);
        }
    }

    private *showTipTask() {
        while (true) {
            const tip = this.tips.pop();
            if (tip) {
                this.tip.text = tip;
                for (let t of Task.sineMotion(0.5, 650, 450)) {
                    this.tip.y = t;
                    yield Wait.frame();
                }
                yield Wait.seconds(1);
                for (let t of Task.sineMotion(0.5, 450, 650)) {
                    this.tip.y = t;
                    yield Wait.frame();
                }
            }
            yield Wait.frame();
        }
    }

    addNews(news: string) {
        this.news.unshift(news);
    }

    private *showNewsTask() {
        while (true) {
            const news = this.news.pop();
            if (news) {
                this.newsLine.text = news;
                const renderer = game.renderer;
                renderer.save();
                game.setPixelFont(32);
                const width = renderer.measureText(news);
                renderer.restore();
                const start = 900;
                for (let t of Task.linearMotion(width / 75 + 1, start, -width - 50)) {
                    this.newsLine.x = t;
                    yield Wait.frame();
                }
            }
            yield Wait.frame();
        }
    }

    render(renderer: Renderer): void {
        renderer.save();
        game.setPixelFont(32);
        super.render(renderer);
        renderer.restore();
    }

    private onAssetsLoaded(): void {
        this.fadeScreen.fadeOut();
        this.itemHandPanel.frozen = false;
    }

    private spawnQuestItems() {
        for (let itemType of this.currentQuest.items) {
            const item = this.createItem(itemType);
            item.cartesianPosition = this.transformer.getRandomPosition();
            item.position = this.transformer.toIsometric(item.cartesianPosition);
            this.addItem(item);
        }
    }

    private get currentQuest() {
        return this.quests[this.currentQuestId];
    }

    private onTvSpotInteract(item?: Item) {
        if (this.tvMessage && this.tvMessage.tasks.length !== 0) {
            return false;
        }
        if (this.currentQuestId === 5 &&
            (this.questState === QuestState.Debriefing || this.questState === QuestState.Sleep)) {
            this.addTip("No messages.");
            return false;
        }
        if (!this.tvOpened) {
            this.tvOpened = true;
            this.movementBlocked = true;
            this.tvMessage = new QuestMessageBox(this.currentQuest, this.questState);
            this.tasks.add(this.slideInMessage(this.tvMessage));
            this.messageLayer.addChild(this.tvMessage);
            this.tvMessage.opacity = 0;
        }
        else {
            if (this.currentQuestId === 6 && this.questState === QuestState.Briefing) {
                this.questState = QuestState.Carpet;
                this.tvMarker.disable();
                this.carpetMarker.enable();
                return false;
            }
            this.tvMessage.tasks.add(this.slideOutMessage(this.tvMessage));
        }
        return false;
    }

    private readonly onScreen = new Vector2(50, 335);
    private readonly offScreen = new Vector2(50, 600);

    private *slideInMessage(messageBox: MessageBox): Iterator<WaitPredicate> {
        game.audio.play("assets/message.mp3");
        messageBox.position = this.offScreen;
        messageBox.opacity = 1;
        yield Wait.task(this.messageMoveTask(messageBox, this.offScreen, this.onScreen));
        this.tvSpot.text = "Close terminal";
    }

    private *slideOutMessage(messageBox: MessageBox) {
        game.audio.play("assets/message.mp3");
        yield Wait.task(this.messageMoveTask(messageBox, this.onScreen, this.offScreen));
        this.messageLayer.removeChild(messageBox);
        this.tvOpened = false;
        this.movementBlocked = false;
        if (this.questState === QuestState.Briefing) {
            this.questState = QuestState.Craft;
            this.tvMarker.disable();
        }
        else if (this.questState === QuestState.Debriefing) {
            this.questState = QuestState.Sleep;
            this.tvMarker.disable();
            this.bedMarker.enable();
        }
        if (this.currentQuestId === 0 && this.pipe.children.length <= 2) {
            let marker = new Marker();
            marker.start = new Vector2(-3, -42);
            this.pipe.addChild(marker);
            marker = new Marker();
            marker.start = new Vector2(-3, -42);
            this.lighter.addChild(marker);
        }
        this.tvSpot.text = "Read last message";
    }

    private *messageMoveTask(messageBox: MessageBox, from: Vector2, to: Vector2) {
        messageBox.position = from.clone();
        for (let t of Task.linearMotion(0.25, from.y, to.y)) {
            messageBox.y = t;
            yield Wait.frame();
        }
    }

    private onBedSpotInteract(item?: Item) {
        if (this.questState !== QuestState.Sleep) {
            this.addTip("I don't want to sleep yet.");
            return false;
        }
        this.tasks.add(this.sleepTask());
        return false;
    }

    private *sleepTask() {
        this.movementBlocked = true;
        this.itemHandPanel.frozen = true;
        this.fadeScreen.text = "Sleeping";
        this.fadeScreen.fadeIn();
        yield Wait.seconds(0.5);
        let newsLine = this.currentQuest.newsLine;
        const weapon = QuestMessageBox.weapon;
        newsLine = weapon ? newsLine.replace("{0}", weapon!.name) : newsLine;
        this.addNews(newsLine);
        this.currentQuestId++;
        this.questState = QuestState.Briefing;
        this.bedMarker.disable();
        this.tvMarker.enable();
        if (this.currentQuestId === 6) {
            const items = this.items.slice();
            for (let item of items) {
                this.removeItem(item);
            }
            for (let item of this.questItems) {
                item.cartesianPosition = this.transformer.getRandomPosition();
                item.position = this.transformer.toIsometric(item.cartesianPosition);
                this.addItem(item);
            }
        }
        else {
            this.spawnQuestItems();
        }
        yield Wait.seconds(1);
        this.fadeScreen.fadeOut();
        yield Wait.seconds(0.5);
        this.movementBlocked = false;
        this.itemHandPanel.frozen = false;
    }

    private onPostSpotInteract(item?: Item) {
        if (this.questState !== QuestState.Craft) {
            this.addTip("No one needs my service now.");
            return false;
        }
        if (!item) {
            this.addTip("I need to send something.");
            return false;
        }
        if (!ItemFactory.isItemSpecial(item)) {
            this.addTip("This item is too simple.");
            return false;
        }
        if (this.currentQuestId === 0) {
            this.pipe.removeChild(this.pipe.children[1]);
            this.lighter.removeChild(this.lighter.children[1]);
            this.itemHandPanel.showTips = false;
            QuestMessageBox.weapon = item;
        }
        if (this.currentQuestId === 5) {
            this.postMarker.disable();
            this.bedMarker.enable();
            this.questState = QuestState.Sleep;
            this.addNews("          ");
            this.addNews("Situation is under control. Chemical leak has been fixed *** If you feel an aggression attacks - drink a lot of water. *** Please stay away from sharp objects.");
        }
        else {
            this.postMarker.disable();
            this.tvMarker.enable();
            this.questState = QuestState.Debriefing;
        }
        this.questItems.push(item);
        return true;
    }

    private setupMarker(marker: Marker, x: number, y: number) {
        marker.start = new Vector2(x, y);
        this.addChild(marker);
    }

    update(delta: number): void {
        this.updateCharacterPosition();
        this.updateItemPanel();
        this.updateParallax();
        this.sortRoomObjects();
        this.updatePostMarker();
        super.update(delta);
    }

    private updatePostMarker() {
        if (this.questState !== QuestState.Craft) {
            return;
        }
        const hands = [this.itemHandPanel.leftHand, this.itemHandPanel.rightHand];
        const goodItems = hands.filter(h => h.item && ItemFactory.isItemSpecial(h.item)).length > 0;
        if (goodItems) {
            this.postMarker.enable();
        }
        else {
            this.postMarker.disable();
        }
    }

    private sortRoomObjects() {
        const objects = this.roomObjects.children.slice();
        for (let child of objects) {
            this.roomObjects.removeChild(child);
        }
        objects.sort((a, b) => a.y < b.y ? -1 : a.y > b.y ? 1 : 0);
        for (let child of objects) {
            this.roomObjects.addChild(child);
        }
    }

    private *updateLightTask(light: Sprite) {
        while (true) {
            for (let t of Task.sineMotion(5, 0.8, 1)) {
                light.opacity = t;
                yield Wait.frame();
            }
            for (let t of Task.sineMotion(5, 1, 0.8)) {
                light.opacity = t;
                yield Wait.frame();
            }
        }
    }

    private updateCharacterPosition() {
        const controls = [Key.Left, Key.Right, Key.Up, Key.Down];
        const pressed = this.movementBlocked ? [] : controls.filter(key => game.input.isKeyPressed(key));
        let direction = Vector2.zero;
        for (let key of pressed) {
            direction = direction.add(this.getVelocityDirection(key!));
        }
        direction.x = Math.abs(direction.x) === 1 ? direction.x * 0.75 : direction.x;
        direction.y = Math.abs(direction.y) === 1 ? direction.y * 0.75 : direction.y;
        const playerVelocity = direction.multiply(this.characterSpeed);
        if (game.input.isKeyPressed(Key.Left) && !game.input.isKeyPressed(Key.Right)) {
            this.player.scale.x = -1;
        }
        else if (!game.input.isKeyPressed(Key.Left) && game.input.isKeyPressed(Key.Right)) {
            this.player.scale.x = 1;
        }
        if (playerVelocity.x === 0 && playerVelocity.y === 0) {
            this.player.runIdleAnimation();
        }
        else {
            this.player.runWalkAnimation();
        }
        this.playerPosition = this.transformer
            .moveInCartesian(this.playerPosition, this.playerPosition.add(playerVelocity));
        this.player.position = this.transformer
            .moveInIsometric(this.player.position, this.transformer.toIsometric(this.playerPosition));
        this.playerPosition = this.transformer.toCartesian(this.player.position);
        this.debug.text = `${Room.toStringV2(this.playerPosition)} ${Room.toStringV2(this.player.position)}`;
        if (this.mousePosition) {
            this.debug.text += ` ${Room.toStringV2(this.mousePosition)}  ${Room
                .toStringV2(this.transformer.toCartesian(this.mousePosition))}`;
        }
    }

    private updateItemPanel() {
        for (let item of this.items) {
            item.position = this.transformer.toIsometric(item.cartesianPosition);
            const closeEnough = this.playerPosition.subtract(item.cartesianPosition).length <= 7;
            if (closeEnough) {
                if (this.itemHandPanel.shownItem !== item) {
                    this.itemHandPanel.showItem(item);
                }
                return;
            }
        }
        if (
            this.setSpecialSpotIfPossible(this.transformer.tv, this.tvSpot) ||
            this.setSpecialSpotIfPossible(this.transformer.bed, this.bedSpot) ||
            this.setSpecialSpotIfPossible(this.transformer.post, this.postSpot) ||
            (this.currentQuestId === 6 && this.questState === QuestState.Carpet && this.setSpecialSpotIfPossible(new Rectangle(20, 50, 40, 65), this.carpetSpot)) ||
            (this.currentQuestId === 6 && this.questState === QuestState.Assembling && this.setSpecialSpotIfPossible(new Rectangle(20, 50, 40, 65), this.assembleSpot))
        ) {
            return;
        }
        this.itemHandPanel.showItem(undefined);
    }

    private setSpecialSpotIfPossible(bounds: Rectangle, spot: SpecialSpot) {
        if (this.isNearby(bounds)) {
            if (this.itemHandPanel.shownItem !== spot) {
                this.itemHandPanel.showItem(spot);
            }
            return true;
        }
        return false;
    }

    private isNearby(obstacle: Rectangle) {
        const center = obstacle.max.add(obstacle.min).divide(2);
        const direction = center.subtract(this.playerPosition);
        const length = direction.length;
        const unit = direction.divide(length);
        return obstacle.contains(this.playerPosition.add(unit)) || obstacle.contains(this.playerPosition);
    }

    private updateParallax() {
        const leftX = this.transformer.isometricLeft.x;
        const rightX = this.transformer.isometricRight.x;
        const x = (this.player.x - leftX) / (rightX - leftX);
        const bottomY = this.transformer.isometricBottom.y;
        const topY = this.transformer.isometricTop.y;
        const y = (this.player.y - topY) / (bottomY - topY);
        this.cityParallax.offset.set(x, y);
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

    createItem(type: ItemType): SimpleItem {
        const item = ItemFactory.createItem(type);
        this.setupItem(item);
        return item;
    }

    setupItem(item: Item) {
        item.onpickup = () => {
            this.removeItem(item);
        };
        item.onput = () => {
            this.addItem(item);
            item.cartesianPosition = this.playerPosition;
            item.position = this.transformer.toIsometric(item.cartesianPosition);
        };
    }

    private addItem(item: Item) {
        this.roomObjects.addChild(item);
        this.items.push(item);
    }

    private removeItem(item: Item) {
        this.roomObjects.removeChild(item);
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    static toStringV2(vector: Vector2) {
        return `${vector.x} ${vector.y}`;
    }
}