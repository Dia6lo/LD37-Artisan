class AssetBundle {
    constructor() {
        this.loadedHost = ObservableEventHost.create();
        this.imageUrls = [
            AssetBundle.room,
            AssetBundle.room2,
            AssetBundle.town,
            AssetBundle.light,
            AssetBundle.playerIdleSheet,
            AssetBundle.playerWalkSheet,
            AssetBundle.rightHand,
            AssetBundle.leftHand,
            AssetBundle.gui,
            AssetBundle.marker,
            AssetBundle.watchTv,
            AssetBundle.sleep,
            AssetBundle.send,
            AssetBundle.piece,
            AssetBundle.craft,
            AssetBundle.arrow,
            AssetBundle.armor,
            AssetBundle.boss,
            AssetBundle.goverment,
            AssetBundle.hero,
            AssetBundle.secretMan,
            AssetBundle.verySecretMan,
            AssetBundle.western,
            AssetBundle.folk,
            AssetBundle.apple,
            AssetBundle.bomb,
            AssetBundle.boot,
            AssetBundle.car,
            AssetBundle.cat,
            AssetBundle.chip,
            AssetBundle.clock,
            AssetBundle.club,
            AssetBundle.dinner,
            AssetBundle.flameThrower,
            AssetBundle.flashlight,
            AssetBundle.glass,
            AssetBundle.glasses,
            AssetBundle.leg,
            AssetBundle.lighter,
            AssetBundle.pen,
            AssetBundle.perpetual,
            AssetBundle.pipe,
            AssetBundle.robot,
            AssetBundle.roller,
            AssetBundle.sandwich,
            AssetBundle.smoke,
            AssetBundle.spyglass,
            AssetBundle.timeMachine,
            AssetBundle.unicorn,
            AssetBundle.pineapple
        ];
    }
    get loaded() {
        return this.loadedHost;
    }
    ;
    static createPath(file) {
        return `${this.assetFolder}/${file}`;
    }
    static createItemPath(file) {
        return `${this.assetFolder}/items/${file}`;
    }
    load() {
        let imagesLoaded = 0;
        const self = this;
        for (let imageUrl of this.imageUrls) {
            const image = new Image();
            image.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === self.imageUrls.length) {
                    self.loadedHost.dispatch(fn => fn());
                }
            };
            image.src = imageUrl;
        }
    }
}
AssetBundle.assetFolder = "assets";
AssetBundle.room = AssetBundle.createPath("Room.png");
AssetBundle.room2 = AssetBundle.createPath("Room2.png");
AssetBundle.town = AssetBundle.createPath("Town.png");
AssetBundle.light = AssetBundle.createPath("Light.png");
AssetBundle.playerIdleSheet = AssetBundle.createPath("PlayerIdleSheet.png");
AssetBundle.playerWalkSheet = AssetBundle.createPath("PlayerWalkSheet.png");
AssetBundle.leftHand = AssetBundle.createPath("LeftHand.png");
AssetBundle.rightHand = AssetBundle.createPath("RightHand.png");
AssetBundle.gui = AssetBundle.createPath("Gui.png");
AssetBundle.marker = AssetBundle.createPath("Marker.png");
AssetBundle.watchTv = AssetBundle.createPath("WatchTV.png");
AssetBundle.sleep = AssetBundle.createPath("Sleep.png");
AssetBundle.send = AssetBundle.createPath("Send.png");
AssetBundle.piece = AssetBundle.createPath("Piece.png");
AssetBundle.craft = AssetBundle.createPath("CraftBody.png");
AssetBundle.arrow = AssetBundle.createPath("Arrow.png");
AssetBundle.armor = AssetBundle.createPath("Armor.png");
AssetBundle.boss = AssetBundle.createPath("Boss.png");
AssetBundle.goverment = AssetBundle.createPath("Goverment.png");
AssetBundle.hero = AssetBundle.createPath("Hero.png");
AssetBundle.secretMan = AssetBundle.createPath("SecretMan.png");
AssetBundle.verySecretMan = AssetBundle.createPath("VerySecretMan.png");
AssetBundle.western = AssetBundle.createPath("Western.png");
AssetBundle.folk = AssetBundle.createPath("Folk.png");
AssetBundle.apple = AssetBundle.createItemPath("Apple.png");
AssetBundle.bomb = AssetBundle.createItemPath("Bomb.png");
AssetBundle.boot = AssetBundle.createItemPath("Boot.png");
AssetBundle.car = AssetBundle.createItemPath("Car.png");
AssetBundle.cat = AssetBundle.createItemPath("Cat.png");
AssetBundle.chip = AssetBundle.createItemPath("Chip.png");
AssetBundle.clock = AssetBundle.createItemPath("Clock.png");
AssetBundle.club = AssetBundle.createItemPath("Club.png");
AssetBundle.dinner = AssetBundle.createItemPath("Dinner.png");
AssetBundle.flameThrower = AssetBundle.createItemPath("FlameThrower.png");
AssetBundle.flashlight = AssetBundle.createItemPath("Flashlight.png");
AssetBundle.glass = AssetBundle.createItemPath("Glass.png");
AssetBundle.glasses = AssetBundle.createItemPath("Glasses.png");
AssetBundle.leg = AssetBundle.createItemPath("Leg.png");
AssetBundle.lighter = AssetBundle.createItemPath("Lighter.png");
AssetBundle.pen = AssetBundle.createItemPath("Pen.png");
AssetBundle.perpetual = AssetBundle.createItemPath("Perpetual.png");
AssetBundle.pipe = AssetBundle.createItemPath("Pipe.png");
AssetBundle.robot = AssetBundle.createItemPath("Robot.png");
AssetBundle.roller = AssetBundle.createItemPath("Roller.png");
AssetBundle.sandwich = AssetBundle.createItemPath("Sandwich.png");
AssetBundle.smoke = AssetBundle.createItemPath("Smoke.png");
AssetBundle.spyglass = AssetBundle.createItemPath("Spyglass.png");
AssetBundle.timeMachine = AssetBundle.createItemPath("TimeMachine.png");
AssetBundle.unicorn = AssetBundle.createItemPath("Unicorn.png");
AssetBundle.pineapple = AssetBundle.createItemPath("Pineapple.png");
class CityParallax extends Widget {
    constructor() {
        super();
        this.texture = Texture.fromImage(AssetBundle.town);
        this.clipSize = new Vector2(136, 56);
        this.parallaxSize = new Vector2(39, 10);
        this.clipStartOffset = new Vector2(19.5, 5);
        this.offset = Vector2.zero;
    }
    render(renderer) {
        const clipStart = this.offset.multiply(this.parallaxSize);
        renderer.renderTexture(this.texture, 0, 0, this.clipSize.x * 2, this.clipSize.y * 2, this.clipStartOffset.x + clipStart.x, this.clipStartOffset.y + clipStart.y, this.clipSize.x, this.clipSize.y);
    }
}
class DisplayableObject extends Widget {
    constructor() {
        super(...arguments);
        this.onpickup = () => { };
        this.onput = () => { };
        this.oninteract = () => false;
        this.pickable = true;
    }
}
class SpecialSpot extends DisplayableObject {
    constructor(texture, tooltip) {
        super();
        this.pickable = false;
        const sprite = new Sprite(texture);
        sprite.size.set(32, 32);
        sprite.pivot = Vector2.half;
        this.displayView = new PanelObjectView(sprite, tooltip, false);
    }
    set text(value) {
        this.displayView.text = value;
    }
}
class SimpleItem extends DisplayableObject {
    constructor(texture, name) {
        super();
        this.image = new Sprite();
        this.cartesianPosition = new Vector2(50, 50);
        this.image.texture = texture;
        this.image.pivot = new Vector2(0.5, 1);
        this.image.size = new Vector2(32, 32);
        this.addChild(this.image);
        this.name = name;
        this.displayView = new HandItemView(this);
    }
    createSprite() {
        const sprite = new Sprite(this.image.texture);
        sprite.size = this.image.size.clone();
        return sprite;
    }
}
class CompoundItem extends DisplayableObject {
    constructor(parts) {
        super();
        this.parts = parts;
        this.cartesianPosition = new Vector2(50, 50);
        this.name = "";
        for (let item of parts) {
            this.name += `${item.name}-`;
        }
        this.name = this.name.substr(0, this.name.length - 1);
        const sprite = this.createSprite();
        sprite.pivot = Vector2.half;
        this.addChild(sprite);
        this.displayView = new HandItemView(this);
    }
    createSprite() {
        const compound = new Widget();
        let width = 0;
        let height = 0;
        for (let item of this.parts) {
            const sprite = item.createSprite();
            sprite.x = width === 0 ? width : width - 5;
            compound.addChild(sprite);
            width += sprite.width - 5;
            if (sprite.height > height) {
                height = sprite.height;
            }
        }
        compound.size.set(width, height);
        return compound;
    }
}
class FadeScreen extends Widget {
    constructor(rendererSize) {
        super();
        this.rendererSize = rendererSize;
        this.text = "Loading";
        this.labelGroup = new Widget();
        this.startLabelGroup = new Widget();
        this.centerLabelGroup = new Widget();
        this.endLabelGroup = new Widget();
        this.label = this.createLabel();
        this.label.position = rendererSize.divide(2);
        this.addChild(this.label);
        this.label.tasks.add(this.updateLabelTask());
    }
    *updateLabelTask() {
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
    setupEnding(items) {
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
    format(text, data) {
        return text.replace("{0}", data);
    }
    *moveEndingTask() {
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
                break;
            }
            yield Wait.frame();
        }
    }
    createLabel(text) {
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
    *moveTask(from, to) {
        for (let t of Task.linearMotion(0.5, from, to)) {
            this.y = t;
            yield Wait.frame();
        }
    }
    render(renderer) {
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
class Game extends Application {
    constructor() {
        super(886, 554);
        this.renderer.backgroundColor = Color.black;
        this.renderer.imageSmoothing = false;
    }
    run() {
        this.room = new Room();
        this.root = this.room;
        super.run();
        const assetLoadEvent = "asset_loading";
        assets.loaded.subscribe(() => {
            appInsights.stopTrackEvent(assetLoadEvent);
            timer.reset();
        });
        assets.load();
        appInsights.startTrackEvent(assetLoadEvent);
    }
    setPixelFont(size) {
        this.renderer.context.font = `${size}px tooltipFont`;
    }
    update(delta) {
        timer.add(delta);
        super.update(delta);
    }
}
Game.neon = Color.fromComponents(41, 196, 191);
class Timer {
    constructor() {
        this.total = 0;
        this.last = 0;
    }
    add(seconds) {
        this.total += seconds;
        this.last += seconds;
    }
    reset() {
        this.last = 0;
    }
}
var timer = new Timer();
var assets = new AssetBundle();
var game;
var trackEvent = (name, properties, measurements) => {
    appInsights.trackEvent(name, properties, measurements);
};
var trackFlowEvent = (name, properties, measurements) => {
    if (!measurements) {
        measurements = {};
    }
    measurements["event_time"] = timer.total;
    measurements["total_time"] = timer.last;
    console.debug(`${timer.last} ${timer.total}`);
    timer.reset();
    appInsights.trackEvent(name, properties, measurements);
};
window.onload = () => {
    game = new Game();
    document.body.appendChild(game.view);
    game.run();
};
class GuiFrame extends NineGrid {
    constructor() {
        super(Texture.fromImage(AssetBundle.gui));
        this.left = 4;
        this.right = 4;
        this.top = 4;
        this.bottom = 4;
    }
}
class PanelObjectView extends Widget {
    constructor(sprite, text, textAbove = true) {
        super();
        this.pivot = Vector2.half;
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        this.tooltip = new Tooltip(text);
        this.tooltip.position = this.size.divide(2).add(new Vector2(0, textAbove ? -sprite.height : sprite.height * 1.25));
        this.addChild(this.tooltip);
    }
    set text(value) {
        this.tooltip.text = value;
    }
}
class HandItemView extends PanelObjectView {
    constructor(item) {
        super(item.createSprite(), item.name);
    }
}
class ItemFactory {
    static isItemSpecial(item) {
        if (item instanceof CompoundItem) {
            return true;
        }
        return this.isComboItem(item);
    }
    static isComboItem(item) {
        const simpleItem = item;
        const matches = this.combos.filter(c => c.result === simpleItem.type);
        return matches.length > 0;
    }
    static mergeItems(first, second) {
        if (first instanceof SimpleItem && second instanceof SimpleItem) {
            for (let combo of this.combos) {
                const match = (first.type === combo.pair.first && second.type === combo.pair.second) ||
                    (second.type === combo.pair.first && first.type === combo.pair.second);
                if (match) {
                    game.audio.play("assets/cool_connect.mp3");
                    return this.createItem(combo.result);
                }
            }
        }
        game.audio.play("assets/usual_connect.wav");
        return new CompoundItem([first, second]);
    }
    static createItem(type) {
        const item = this.getItemObject(type);
        item.type = type;
        return item;
    }
    static getItemObject(type) {
        switch (type) {
            case 0:
                return this.constructItem(AssetBundle.apple, "Apple");
            case 1:
                return this.constructItem(AssetBundle.bomb, "Bomb");
            case 2:
                return this.constructItem(AssetBundle.boot, "Boot");
            case 3:
                return this.constructItem(AssetBundle.car, "Car");
            case 4:
                return this.constructItem(AssetBundle.cat, "Cat");
            case 5:
                return this.constructItem(AssetBundle.chip, "Chip");
            case 6:
                return this.constructItem(AssetBundle.clock, "Clock");
            case 7:
                return this.constructItem(AssetBundle.club, "Club");
            case 8:
                return this.constructItem(AssetBundle.dinner, "Dinner");
            case 9:
                return this.constructItem(AssetBundle.flameThrower, "Flamethrower");
            case 10:
                return this.constructItem(AssetBundle.flashlight, "Flashlight");
            case 11:
                return this.constructItem(AssetBundle.glass, "Glass");
            case 12:
                return this.constructItem(AssetBundle.glasses, "Glasses");
            case 13:
                return this.constructItem(AssetBundle.leg, "Leg");
            case 14:
                return this.constructItem(AssetBundle.lighter, "Lighter");
            case 15:
                return this.constructItem(AssetBundle.pen, "Pen");
            case 16:
                return this.constructItem(AssetBundle.perpetual, "Perpetual Motion Machine");
            case 17:
                return this.constructItem(AssetBundle.pipe, "Pipe");
            case 18:
                return this.constructItem(AssetBundle.robot, "Robot");
            case 19:
                return this.constructItem(AssetBundle.roller, "Roller Skates");
            case 20:
                return this.constructItem(AssetBundle.sandwich, "Sandwich");
            case 21:
                return this.constructItem(AssetBundle.smoke, "Smoke Grenade");
            case 22:
                return this.constructItem(AssetBundle.spyglass, "Spyglass");
            case 23:
                return this.constructItem(AssetBundle.timeMachine, "Time Machine");
            case 24:
                return this.constructItem(AssetBundle.unicorn, "Unicorn");
            case 25:
                return this.constructItem(AssetBundle.pineapple, "Pineapple");
            default:
                throw "Error creating item";
        }
    }
    static constructItem(path, tooltip) {
        return new SimpleItem(Texture.fromImage(path), tooltip);
    }
}
ItemFactory.combos = [
    { pair: { first: 17, second: 14 }, result: 9 },
    { pair: { first: 6, second: 14 }, result: 1 },
    { pair: { first: 17, second: 0 }, result: 7 },
    { pair: { first: 4, second: 14 }, result: 21 },
    { pair: { first: 11, second: 17 }, result: 22 },
    { pair: { first: 11, second: 11 }, result: 12 },
    { pair: { first: 11, second: 14 }, result: 10 },
    { pair: { first: 0, second: 20 }, result: 8 },
    { pair: { first: 4, second: 20 }, result: 16 },
    { pair: { first: 3, second: 2 }, result: 19 },
    { pair: { first: 2, second: 17 }, result: 13 },
    { pair: { first: 6, second: 11 }, result: 5 },
    { pair: { first: 6, second: 4 }, result: 18 },
    { pair: { first: 4, second: 15 }, result: 24 },
    { pair: { first: 6, second: 3 }, result: 23 }
];
class ItemHand extends Widget {
    constructor(flipped) {
        super();
        this.contentHolder = new WidgetHolder();
        this.item = undefined;
        this.pivot = Vector2.half;
        const sprite = flipped ? Sprite.fromImage(AssetBundle.leftHand) : Sprite.fromImage(AssetBundle.rightHand);
        sprite.pivot = Vector2.half;
        this.addChild(sprite);
        this.contentHolder.pivot = Vector2.half;
        this.contentHolder.position.set(50, 50);
        this.addChild(this.contentHolder);
    }
    render(renderer) {
        renderer.save();
        game.setPixelFont(24);
        super.render(renderer);
        renderer.restore();
    }
    holdItem(item) {
        this.item = item;
        this.contentHolder.clear();
        if (item) {
            this.contentHolder.content = item.displayView;
            this.justPickedUp = true;
        }
    }
}
class ItemHandPanel extends Widget {
    constructor(room) {
        super();
        this.room = room;
        this.rightHand = new ItemHand(false);
        this.leftHand = new ItemHand(true);
        this.itemHolder = new WidgetHolder();
        this.shownItem = undefined;
        this.showTips = true;
        this.tipGroup = new Widget();
        this.firstZ = true;
        this.firstX = true;
        this.firstCraft = true;
        this.firstCraftUnique = true;
        this.firstCraftCompound = true;
        this.firstDisassemble = true;
        this.size.set(440, 100);
        this.pivot = Vector2.half;
        const rightArrow = Sprite.fromImage(AssetBundle.arrow);
        rightArrow.size.set(52, 18);
        rightArrow.pivot.set(0, 0.5);
        this.tipGroup.addChild(rightArrow);
        const leftArrow = Sprite.fromImage(AssetBundle.arrow);
        leftArrow.size.set(52, 18);
        leftArrow.pivot.set(0, 0.5);
        leftArrow.scale.set(-1, 1);
        this.tipGroup.addChild(leftArrow);
        this.addChild(this.tipGroup);
        this.rightHand.position.set(this.size.x, this.size.y / 2);
        this.rightHand.tasks.add(this.handMovementTask(this.rightHand, 106));
        this.addChild(this.rightHand);
        this.leftHand.position.set(0, this.size.y / 2);
        this.leftHand.tasks.add(this.handMovementTask(this.leftHand, 108));
        this.addChild(this.leftHand);
        this.itemHolder.pivot = Vector2.half;
        this.itemHolder.position = this.size.divide(2);
        this.addChild(this.itemHolder);
        rightArrow.position.set(this.rightHand.x - this.rightHand.width * 1.5, this.rightHand.y - this.rightHand.height / 2);
        leftArrow.position.set(this.leftHand.x + this.rightHand.width * 0.5, this.rightHand.y - this.rightHand.height / 2);
    }
    showItem(item) {
        if (item) {
            this.itemHolder.content = item.displayView;
        }
        else {
            this.itemHolder.clear();
        }
        this.shownItem = item;
    }
    *handMovementTask(hand, key) {
        const otherHand = hand === this.rightHand ? this.leftHand : this.rightHand;
        const start = hand.position.x;
        const end = this.itemHolder.position.x;
        const speed = 15;
        let destination;
        while (true) {
            this.tipGroup.opacity = this.showTips && hand.item && otherHand.item ? 1 : 0;
            if (this.frozen) {
                yield Wait.frame();
                continue;
            }
            if (game.input.isKeyPressed(key)) {
                destination = end;
            }
            else {
                if (hand.x === end && hand.item && !hand.justPickedUp) {
                    const item = hand.item;
                    this.showItem(item);
                    hand.holdItem(undefined);
                    item.onput();
                }
                hand.justPickedUp = false;
                destination = start;
            }
            if (hand.x !== destination) {
                const direction = Math.sign(destination - hand.x);
                const offset = direction * speed;
                hand.x += offset;
                if ((direction < 0 && hand.x < destination) || (direction > 0 && hand.x > destination)) {
                    hand.x = destination;
                }
                if (hand.x === destination) {
                    if (destination === end) {
                        if (this.shownItem && !this.shownItem.pickable) {
                            if (this.shownItem.oninteract(hand.item)) {
                                hand.holdItem(undefined);
                            }
                            else {
                                hand.justPickedUp = true;
                            }
                        }
                        else if (!hand.item) {
                            if (hand.x === otherHand.x && otherHand.item && otherHand.item instanceof CompoundItem) {
                                const item = otherHand.item;
                                this.leftHand.holdItem(item.parts[0]);
                                this.rightHand.holdItem(item.parts[1]);
                                if (this.firstDisassemble) {
                                    const trackProperties = game.room.trackProperties;
                                    trackProperties["item"] = item.name;
                                    trackEvent("first_disassemble", trackProperties);
                                    this.firstDisassemble = false;
                                }
                            }
                            else if (this.shownItem && this.shownItem.pickable) {
                                const item = this.shownItem;
                                hand.holdItem(item);
                                this.showItem(undefined);
                                item.onpickup();
                                const trackProperties = game.room.trackProperties;
                                trackProperties["item"] = item.name;
                                if (key === 106 && this.firstX) {
                                    trackFlowEvent("first_item_right", trackProperties);
                                    this.firstX = false;
                                }
                                else if (key === 108 && this.firstZ) {
                                    trackFlowEvent("first_item_left", trackProperties);
                                    this.firstZ = false;
                                }
                            }
                            if (hand.x === otherHand.x && !otherHand.item) {
                                game.audio.play("assets/hlop.mp3");
                            }
                        }
                        else {
                            if (hand.x === otherHand.x && otherHand.item) {
                                const left = this.leftHand.item;
                                const right = this.rightHand.item;
                                const newItem = ItemFactory.mergeItems(left, right);
                                this.room.setupItem(newItem);
                                this.rightHand.holdItem(undefined);
                                this.leftHand.holdItem(newItem);
                                const trackProperties = game.room.trackProperties;
                                trackProperties["item"] = newItem.name;
                                if (this.firstCraft) {
                                    trackFlowEvent("first_craft", trackProperties);
                                    this.firstCraft = false;
                                }
                                if (newItem instanceof SimpleItem && this.firstCraftUnique) {
                                    trackEvent("first_craft_unique", trackProperties);
                                    this.firstCraftUnique = false;
                                }
                                if (newItem instanceof CompoundItem && this.firstCraftCompound) {
                                    trackEvent("first_craft_compound", trackProperties);
                                    this.firstCraftCompound = false;
                                }
                            }
                        }
                    }
                }
            }
            yield Wait.frame();
        }
    }
}
class Marker extends Sprite {
    constructor() {
        super(Texture.fromImage(AssetBundle.marker));
        this.pivot = Vector2.half;
        this.size.set(26, 22);
        this.tasks.add(this.moveTask());
    }
    *moveTask() {
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
class WidgetHolder extends Widget {
    get content() {
        return this.children[0];
    }
    set content(widget) {
        this.clear();
        this.addChild(widget);
    }
    clear() {
        const children = this.children.slice();
        for (let child of children) {
            this.removeChild(child);
        }
    }
}
class Player extends Widget {
    constructor() {
        super();
        this.idleSpriteSheet = Spritesheet.fromImage(AssetBundle.playerIdleSheet);
        this.walkSpriteSheet = Spritesheet.fromImage(AssetBundle.playerWalkSheet);
        this.widgetSize = new Vector2(40, 118);
        this.spriteSize = new Vector2(20, 59);
        this.spriteHolder = new WidgetHolder();
        this.animationName = "Animation";
        this.stepSound = game.audio.play("assets/steps.mp3", true, 0);
        this.size = this.widgetSize;
        this.setupAnimation(this.idleSpriteSheet, 4, 15);
        this.setupAnimation(this.walkSpriteSheet, 8, 12);
        this.runIdleAnimation();
        this.addChild(this.spriteHolder);
    }
    setupAnimation(spritesheet, frameCount, frameDelay) {
        spritesheet.size = this.widgetSize;
        spritesheet.spriteSize = this.spriteSize;
        const animation = new Animation(frameCount * frameDelay);
        animation.finalAction = Animation.loop();
        const spriteIdAnimator = Spritesheet.spriteIdAnimator();
        for (let i = 0; i < frameCount; i++) {
            spriteIdAnimator.setFrame(i * frameDelay, i);
        }
        animation.setAnimator(spriteIdAnimator);
        spritesheet.animations.set(this.animationName, animation);
    }
    runIdleAnimation() {
        if (this.idle) {
            return;
        }
        this.stepSound.pause();
        this.idle = true;
        this.spriteHolder.content = this.idleSpriteSheet;
        this.idleSpriteSheet.runAnimation(this.animationName);
    }
    runWalkAnimation() {
        if (!this.idle) {
            return;
        }
        this.stepSound = game.audio.play("assets/steps.mp3", true, 0.25);
        this.idle = false;
        this.spriteHolder.content = this.walkSpriteSheet;
        this.walkSpriteSheet.runAnimation(this.animationName);
    }
}
class PositionTransformer {
    constructor() {
        this.cartesianBounds = new Vector2(100, 100);
        this.tv = new Rectangle(0, 34, 14, 60);
        this.bed = new Rectangle(0, 56, 18, 102);
        this.post = new Rectangle(68, 0, 97, 15.5);
        this.obstacles = [
            new Rectangle(0, 0, 20, 38),
            new Rectangle(0, 0, 40, 20),
            this.tv,
            this.bed,
            new Rectangle(16, 86, 28, 102),
            new Rectangle(38, 0, 70, 10.01),
            this.post,
            new Rectangle(95, 0, 102, 7)
        ];
        this.isometricTop = new Vector2(432, 204);
        this.isometricBottom = new Vector2(432, 584);
        this.isometricLeft = new Vector2(48, 394);
        this.isometricRight = new Vector2(816, 394);
        this.isometricSliceHeight = 474;
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.cartesianBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.cartesianBounds.y / 2;
    }
    moveInCartesian(from, to) {
        let result = to.clone();
        result.x = Math.clamp(result.x, 0, this.cartesianBounds.x);
        result.y = Math.clamp(result.y, 0, this.cartesianBounds.y);
        for (let rect of this.obstacles) {
            if (rect.contains(result)) {
                const above = from.y <= rect.top;
                const below = from.y >= rect.bottom;
                const left = from.x <= rect.left;
                const right = from.x >= rect.right;
                if ([above, below, left, right].filter(b => b).length > 1) {
                    return from;
                }
                let intersetingLineStart;
                let intersetingLineEnd;
                const leftTop = new Vector2(rect.left, rect.top);
                const rightTop = new Vector2(rect.right, rect.top);
                const leftBottom = new Vector2(rect.left, rect.bottom);
                const rightBottom = new Vector2(rect.right, rect.bottom);
                if (above) {
                    intersetingLineStart = leftTop;
                    intersetingLineEnd = rightTop;
                }
                else if (below) {
                    intersetingLineStart = leftBottom;
                    intersetingLineEnd = rightBottom;
                }
                else if (right) {
                    intersetingLineStart = rightTop;
                    intersetingLineEnd = rightBottom;
                }
                else if (left) {
                    intersetingLineStart = leftTop;
                    intersetingLineEnd = leftBottom;
                }
                else {
                    throw "Error getting intersecting line";
                }
                const intersection = this.getIntersection(from, result, intersetingLineStart, intersetingLineEnd);
                if (intersection) {
                    result = intersection;
                }
                if (above) {
                    result.y -= 0.1;
                }
                else if (below) {
                    result.y += 0.1;
                }
                else if (right) {
                    result.x += 0.1;
                }
                else if (left) {
                    result.x -= 0.1;
                }
            }
        }
        return result;
    }
    getIntersection(v1, v2, v3, v4) {
        const x1 = v1.x;
        const y1 = v1.y;
        const x2 = v2.x;
        const y2 = v2.y;
        const x3 = v3.x;
        const y3 = v3.y;
        const x4 = v4.x;
        const y4 = v4.y;
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) {
            return undefined;
        }
        const x = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        const y = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        return new Vector2(x / denominator, y / denominator);
    }
    moveInIsometric(from, to) {
        const result = to.clone();
        result.y = Math.clamp(result.y, this.isometricTop.y, this.isometricSliceHeight);
        return result;
    }
    isLeft(a, b, c) {
        return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
    }
    toIsometric(position) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return new Vector2(x, y).add(this.isometricTop);
    }
    toCartesian(position) {
        const noOffset = position.subtract(this.isometricTop);
        const x = (noOffset.x / this.xModifier + noOffset.y / this.yModifier) / 2;
        const y = (noOffset.y / this.yModifier - noOffset.x / this.xModifier) / 2;
        return new Vector2(x, y);
    }
    getRandomPosition() {
        let position = undefined;
        const low = new Vector2(40, 100);
        const high = new Vector2(100, 40);
        while (!position) {
            position = new Vector2(Math.random(), Math.random()).multiply(100);
            const side = (high.x - low.x) * (position.y - low.y) - (position.x - low.x) * (high.y - low.y);
            if (side >= 0) {
                position = undefined;
                continue;
            }
            for (let obstacle of this.obstacles) {
                const bigObstacle = obstacle.clone();
                bigObstacle.min.mutate().subtract(7);
                bigObstacle.max.mutate().add(7);
                if (bigObstacle.contains(position)) {
                    position = undefined;
                    break;
                }
            }
        }
        return position;
    }
}
class Quest {
    static createStory() {
        return [
            {
                items: [17, 14, 0, 6, 4],
                face: AssetBundle.boss,
                nickname: "Crazyvan",
                briefing: [
                    "Good day, Artis@n! I have a great plan and I need",
                    "a powerful weapon to accomplish it.",
                    "Craft it quickly and quietly and I will buy it."
                ],
                debriefing: [
                    "Looks strange, but I’ve heard about your craftstyle.",
                    "But if it's a fake, I will FIND YOU.",
                    "                                             Cheers."
                ],
                newsLine: "A man with a {0} robbed main bank of CyberGhoul last night. If you know any information about criminal - call police immediately."
            },
            {
                items: [17, 14, 11, 11],
                face: AssetBundle.verySecretMan,
                nickname: "FBI",
                briefing: [
                    "Our agent was killed by a new {0}",
                    "weapon yesterday. We will pay for a prototype",
                    "of new vision upgrade."
                ],
                debriefing: [
                    "Good job, agent Artis@n. We sent the device to",
                    "our R&D department for subsequent research.",
                    ""
                ],
                newsLine: "Government has increased funding for vision upgrades research. *** Taxes were increased by 15%"
            },
            {
                items: [20, 0, 4, 15],
                face: AssetBundle.folk,
                nickname: "B1gM0ther",
                briefing: [
                    "I’ve heard that you can craft anything. I’ll give you",
                    "my last money for a new energy source.",
                    "P.S. Geez, new taxes are crazy!"
                ],
                debriefing: [
                    "Thank goodness!",
                    "Big thanks, my family can now run away from city.",
                    ""
                ],
                newsLine: "The number of CyberGhoul residents decreased by six today."
            },
            {
                items: [17, 2, 3, 25],
                face: AssetBundle.secretMan,
                nickname: "Buggy",
                briefing: [
                    "Hello. Artis@n. My project’s deadline was yesterday,",
                    "so I outsource you developing of movement system for",
                    "brand new Cyberdog. Please, send it ASAP."
                ],
                debriefing: [
                    "It works. Sometimes.",
                    "Usually, I don't have a time for finding bugs.",
                    "I appreciate your help."
                ],
                newsLine: "New Cyberdogs will return escaped residents from dangerous wild to safety. *** Government decides to decrease taxes by 0.5% *** BREAKING NEWS: Cyberdogs have gone aggressive after release, avoid them at all costs!"
            },
            {
                items: [2, 3, 6, 4, 11],
                face: AssetBundle.western,
                nickname: "Santafe",
                briefing: [
                    "Good day, mister Artis@n! My employees fail deadlines",
                    "every time, so I want to replace them with AI systems.",
                    "Can your genius help me?"
                ],
                debriefing: [
                    "Hmm. You didn't receive my five last calls. I thought",
                    "that you are dead. But I was wrong, sorry.",
                    ""
                ],
                newsLine: "CyberSoft corporation has fired 90% of employees *** CyberSoft's share price has fell by 60% *** ATTENTION: City is not burning. Is is just a try-out of new fireworks. Please, stay inside your homes"
            },
            {
                items: [3, 6, 4, 15],
                face: AssetBundle.goverment,
                nickname: "BOSSHERE",
                briefing: [
                    "Artis@n? We have really big problems - people assault",
                    "the Government with {0}.",
                    "Only miracle can help us. Just DO something."
                ],
                debriefing: [
                    "",
                    "",
                    ""
                ],
                newsLine: "Situation is under control. Chemical leak has been fixed. If you feel an aggression attack - drink a lot of water. *** Please stay away from sharp objects."
            },
            {
                items: [],
                face: AssetBundle.hero,
                nickname: "Artis@n",
                briefing: [
                    "Good unending night, ghost. Can you leave the room?",
                    "Do you have a shadow? Guess what? We are both dead.",
                    "But I know a Genius that can craft a body for us ;)"
                ],
                debriefing: [
                    "",
                    "",
                    ""
                ],
                newsLine: ""
            }
        ];
    }
}
class Room extends Widget {
    constructor() {
        super();
        this.room = Sprite.fromImage(AssetBundle.room);
        this.player = new Player();
        this.transformer = new PositionTransformer();
        this.playerPosition = new Vector2(44, 65);
        this.characterSpeed = 0.3;
        this.debug = new Label();
        this.cityParallax = new CityParallax();
        this.items = [];
        this.roomObjects = new Widget();
        this.tvMarker = new Marker();
        this.tvSpot = new SpecialSpot(Texture.fromImage(AssetBundle.watchTv), "Read last message");
        this.bedMarker = new Marker();
        this.bedSpot = new SpecialSpot(Texture.fromImage(AssetBundle.sleep), "Go to bed");
        this.postMarker = new Marker();
        this.postSpot = new SpecialSpot(Texture.fromImage(AssetBundle.send), "Send requested item");
        this.carpetMarker = new Marker();
        this.carpetSpot = new SpecialSpot(Texture.fromImage(AssetBundle.piece), "Pull carpet");
        this.assembleSpot = new SpecialSpot(Texture.fromImage(AssetBundle.craft), "Setup Power Source");
        this.quests = Quest.createStory();
        this.currentQuestId = 0;
        this.questState = 0;
        this.movementBlocked = false;
        this.tvOpened = false;
        this.messageLayer = new Widget();
        this.fadeScreen = new FadeScreen(new Vector2(886, 554));
        this.questItems = [];
        this.tips = [];
        this.tip = new Tooltip("");
        this.news = [];
        this.newsLine = new Label();
        this.finalItems = [];
        this.assemblingStage = 0;
        this.onScreen = new Vector2(50, 335);
        this.offScreen = new Vector2(50, 600);
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
            const simpleItem = item;
            if (simpleItem.type === 17) {
                this.pipe = item;
            }
            if (simpleItem.type === 14) {
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
    onCarpetSpotInteract(item) {
        this.room.texture = Texture.fromImage(AssetBundle.room2);
        const armor = Sprite.fromImage(AssetBundle.armor);
        armor.position.set(282, 338);
        armor.size.set(66, 58);
        this.room.addChild(armor);
        this.questState = 5;
        trackFlowEvent("pull_carpet", this.trackProperties);
        return false;
    }
    get trackProperties() {
        return { "global_stage": this.globalStageId.toString(), "stage": this.questState.toString(), "quest": this.currentQuestId.toString() };
    }
    get globalStageId() {
        return this.currentQuestId * 3 + this.questState;
    }
    onAssembleSpotInteract(item) {
        if (item) {
            let trackProperties = this.trackProperties;
            trackProperties["assemble_stage"] = this.assemblingStage.toString();
            trackProperties["item"] = item.name;
            trackFlowEvent("assemble", trackProperties);
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
                    trackProperties = this.trackProperties;
                    trackProperties["power"] = this.finalItems[0].name;
                    trackProperties["computing"] = this.finalItems[0].name;
                    trackProperties["vision"] = this.finalItems[0].name;
                    trackProperties["movement"] = this.finalItems[0].name;
                    trackProperties["weapon"] = this.finalItems[0].name;
                    trackProperties["miracle"] = this.finalItems[0].name;
                    trackEvent("assembled_items", trackProperties);
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
    addTip(tip) {
        if (this.tips.filter(t => t === tip).length === 0) {
            this.tips.unshift(tip);
        }
    }
    *showTipTask() {
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
    addNews(news) {
        this.news.unshift(news);
    }
    *showNewsTask() {
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
    render(renderer) {
        renderer.save();
        game.setPixelFont(32);
        super.render(renderer);
        renderer.restore();
    }
    onAssetsLoaded() {
        this.fadeScreen.fadeOut();
        this.itemHandPanel.frozen = false;
    }
    spawnQuestItems() {
        for (let itemType of this.currentQuest.items) {
            const item = this.createItem(itemType);
            item.cartesianPosition = this.transformer.getRandomPosition();
            item.position = this.transformer.toIsometric(item.cartesianPosition);
            this.addItem(item);
        }
    }
    get currentQuest() {
        return this.quests[this.currentQuestId];
    }
    onTvSpotInteract(item) {
        if (this.tvMessage && this.tvMessage.tasks.length !== 0) {
            trackEvent("force_close_terminal", this.trackProperties);
            return false;
        }
        if (this.currentQuestId === 5 &&
            (this.questState === 2 || this.questState === 3)) {
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
            trackFlowEvent("open_terminal", this.trackProperties);
        }
        else {
            if (this.currentQuestId === 6 && this.questState === 0) {
                this.questState = 4;
                this.tvMarker.disable();
                this.carpetMarker.enable();
                return false;
            }
            this.tvMessage.tasks.add(this.slideOutMessage(this.tvMessage));
            trackFlowEvent("close_terminal", this.trackProperties);
        }
        return false;
    }
    *slideInMessage(messageBox) {
        game.audio.play("assets/message.mp3");
        messageBox.position = this.offScreen;
        messageBox.opacity = 1;
        yield Wait.task(this.messageMoveTask(messageBox, this.offScreen, this.onScreen));
        this.tvSpot.text = "Close terminal";
    }
    *slideOutMessage(messageBox) {
        game.audio.play("assets/message.mp3");
        yield Wait.task(this.messageMoveTask(messageBox, this.onScreen, this.offScreen));
        this.messageLayer.removeChild(messageBox);
        this.tvOpened = false;
        this.movementBlocked = false;
        if (this.questState === 0) {
            this.questState = 1;
            this.tvMarker.disable();
        }
        else if (this.questState === 2) {
            this.questState = 3;
            this.tvMarker.disable();
            this.bedMarker.enable();
        }
        if (this.currentQuestId === 0 && !this.pipeMarker) {
            this.pipeMarker = new Marker();
            this.pipeMarker.start = new Vector2(-3, -42);
            this.pipe.addChild(this.pipeMarker);
            this.lighterMarker = new Marker();
            this.lighterMarker.start = new Vector2(-3, -42);
            this.lighter.addChild(this.lighterMarker);
        }
        this.tvSpot.text = "Read last message";
    }
    *messageMoveTask(messageBox, from, to) {
        messageBox.position = from.clone();
        for (let t of Task.linearMotion(0.25, from.y, to.y)) {
            messageBox.y = t;
            yield Wait.frame();
        }
    }
    onBedSpotInteract(item) {
        if (this.questState !== 3) {
            this.addTip("I don't want to sleep yet.");
            return false;
        }
        trackFlowEvent("sleep", this.trackProperties);
        trackEvent("end_quest", this.trackProperties);
        this.tasks.add(this.sleepTask());
        return false;
    }
    *sleepTask() {
        this.movementBlocked = true;
        this.itemHandPanel.frozen = true;
        this.fadeScreen.text = "Sleeping";
        this.fadeScreen.fadeIn();
        yield Wait.seconds(0.5);
        let newsLine = this.currentQuest.newsLine;
        const weapon = QuestMessageBox.weapon;
        newsLine = weapon ? newsLine.replace("{0}", weapon.name) : newsLine;
        this.addNews(newsLine);
        this.currentQuestId++;
        this.questState = 0;
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
    onPostSpotInteract(item) {
        if (this.questState !== 1) {
            this.addTip("No one needs my service now.");
            game.audio.play("assets/incorrect.wav", false, 0.25);
            return false;
        }
        if (!item) {
            this.addTip("I need to send something.");
            game.audio.play("assets/incorrect.wav", false, 0.25);
            return false;
        }
        const trackProperties = this.trackProperties;
        trackProperties["item"] = item.name;
        if (!ItemFactory.isItemSpecial(item)) {
            this.addTip("This item is too simple.");
            trackEvent("post_simple_item", trackProperties);
            game.audio.play("assets/incorrect.wav", false, 0.25);
            return false;
        }
        if (this.currentQuestId === 0) {
            if (this.pipeMarker) {
                this.pipe.removeChild(this.pipeMarker);
                this.lighter.removeChild(this.lighterMarker);
            }
            this.itemHandPanel.showTips = false;
            QuestMessageBox.weapon = item;
        }
        if (this.currentQuestId === 5) {
            this.postMarker.disable();
            this.bedMarker.enable();
            this.questState = 3;
            this.addNews("          ");
            this.addNews("Situation is under control. Chemical leak has been fixed *** If you feel an aggression attacks - drink a lot of water. *** Please stay away from sharp objects.");
        }
        else {
            this.postMarker.disable();
            this.tvMarker.enable();
            this.questState = 2;
        }
        trackFlowEvent("post_item", trackProperties);
        this.questItems.push(item);
        return true;
    }
    setupMarker(marker, x, y) {
        marker.start = new Vector2(x, y);
        this.addChild(marker);
    }
    update(delta) {
        this.updateCharacterPosition();
        this.updateItemPanel();
        this.updateParallax();
        this.sortRoomObjects();
        this.updatePostMarker();
        super.update(delta);
    }
    updatePostMarker() {
        if (this.questState !== 1) {
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
    sortRoomObjects() {
        const objects = this.roomObjects.children.slice();
        for (let child of objects) {
            this.roomObjects.removeChild(child);
        }
        objects.sort((a, b) => a.y < b.y ? -1 : a.y > b.y ? 1 : 0);
        for (let child of objects) {
            this.roomObjects.addChild(child);
        }
    }
    *updateLightTask(light) {
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
    updateCharacterPosition() {
        const controls = [47, 48, 45, 46];
        const pressed = this.movementBlocked ? [] : controls.filter(key => game.input.isKeyPressed(key));
        let direction = Vector2.zero;
        for (let key of pressed) {
            direction = direction.add(this.getVelocityDirection(key));
        }
        direction.x = Math.abs(direction.x) === 1 ? direction.x * 0.75 : direction.x;
        direction.y = Math.abs(direction.y) === 1 ? direction.y * 0.75 : direction.y;
        const playerVelocity = direction.multiply(this.characterSpeed);
        if (game.input.isKeyPressed(47) && !game.input.isKeyPressed(48)) {
            this.player.scale.x = -1;
        }
        else if (!game.input.isKeyPressed(47) && game.input.isKeyPressed(48)) {
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
    updateItemPanel() {
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
        if (this.setSpecialSpotIfPossible(this.transformer.tv, this.tvSpot) ||
            this.setSpecialSpotIfPossible(this.transformer.bed, this.bedSpot) ||
            this.setSpecialSpotIfPossible(this.transformer.post, this.postSpot) ||
            (this.currentQuestId === 6 && this.questState === 4 && this.setSpecialSpotIfPossible(new Rectangle(20, 50, 40, 65), this.carpetSpot)) ||
            (this.currentQuestId === 6 && this.questState === 5 && this.setSpecialSpotIfPossible(new Rectangle(20, 50, 40, 65), this.assembleSpot))) {
            return;
        }
        this.itemHandPanel.showItem(undefined);
    }
    setSpecialSpotIfPossible(bounds, spot) {
        if (this.isNearby(bounds)) {
            if (this.itemHandPanel.shownItem !== spot) {
                this.itemHandPanel.showItem(spot);
            }
            return true;
        }
        return false;
    }
    isNearby(obstacle) {
        const center = obstacle.max.add(obstacle.min).divide(2);
        const direction = center.subtract(this.playerPosition);
        const length = direction.length;
        const unit = direction.divide(length);
        return obstacle.contains(this.playerPosition.add(unit)) || obstacle.contains(this.playerPosition);
    }
    updateParallax() {
        const leftX = this.transformer.isometricLeft.x;
        const rightX = this.transformer.isometricRight.x;
        const x = (this.player.x - leftX) / (rightX - leftX);
        const bottomY = this.transformer.isometricBottom.y;
        const topY = this.transformer.isometricTop.y;
        const y = (this.player.y - topY) / (bottomY - topY);
        this.cityParallax.offset.set(x, y);
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
    createItem(type) {
        const item = ItemFactory.createItem(type);
        this.setupItem(item);
        return item;
    }
    setupItem(item) {
        item.onpickup = () => {
            this.removeItem(item);
        };
        item.onput = () => {
            this.addItem(item);
            item.cartesianPosition = this.playerPosition;
            item.position = this.transformer.toIsometric(item.cartesianPosition);
        };
    }
    addItem(item) {
        this.roomObjects.addChild(item);
        this.items.push(item);
    }
    removeItem(item) {
        this.roomObjects.removeChild(item);
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    static toStringV2(vector) {
        return `${vector.x} ${vector.y}`;
    }
}
class Spritesheet extends Widget {
    constructor(texture) {
        super();
        this.texture = texture;
        this.spriteSize = Vector2.zero;
        this.spriteId = 0;
    }
    static fromImage(url) {
        return new Spritesheet(Texture.fromImage(url));
    }
    render(renderer) {
        renderer.renderTexture(this.texture, 0, 0, this.size.x, this.size.y, this.spriteSize.x * this.spriteId, 0, this.spriteSize.x, this.spriteSize.y);
        super.render(renderer);
    }
}
Spritesheet.spriteIdAnimator = () => new NumberAnimator("spriteId");
class Tooltip extends GuiFrame {
    constructor(text, color = Game.neon) {
        super();
        this.nameLabel = new Label();
        this.nameLabel.text = text;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = color;
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
    }
    set text(value) {
        this.nameLabel.text = value;
    }
    beforeRender(renderer) {
        super.beforeRender(renderer);
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        const measure = new Vector2(renderer.measureText(this.nameLabel.text), fontSize);
        this.size = measure.add(new Vector2(15, 0));
        this.nameLabel.position = this.size.divide(2).subtract(new Vector2(0, 10));
        renderer.restore();
    }
    render(renderer) {
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        super.render(renderer);
        renderer.restore();
    }
}
class MessageBox extends GuiFrame {
    constructor(nickname, line1, line2, line3) {
        super();
        this.fontSize = 32;
        this.size = new Vector2(780, 170);
        this.createLabel(line1, 0);
        this.createLabel(line2, 1);
        this.createLabel(line3, 2);
    }
    createLabel(text, lineIndex) {
        const label = new Label(text);
        label.y = lineIndex * (this.fontSize + 5) + 20;
        label.x = 35;
        label.fontColor = Game.neon;
        this.addChild(label);
    }
    render(renderer) {
        renderer.save();
        game.setPixelFont(this.fontSize);
        super.render(renderer);
        renderer.restore();
    }
}
class QuestMessageBox extends MessageBox {
    constructor(quest, state) {
        const f = QuestMessageBox.format;
        if (state === 0 || state === 1) {
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
    update(delta) {
        super.update(delta);
        this.nickName.position = this.faceFrame.position.add(this.nickName.size.divide(2));
        this.nickName.y += this.faceFrame.height - 15;
        this.nickName.x += (this.faceFrame.width - this.nickName.width) / 2;
    }
    static format(text) {
        return QuestMessageBox.weapon ? text.replace("{0}", QuestMessageBox.weapon.name).substr(0, 55) : text;
    }
}
//# sourceMappingURL=app.js.map