class AssetBundle {
    constructor() {
        this.loadedHost = ObservableEventHost.create();
        this.imageUrls = [
            AssetBundle.apple,
            AssetBundle.room,
            AssetBundle.town,
            AssetBundle.light,
            AssetBundle.playerIdleSheet,
            AssetBundle.playerWalkSheet,
            AssetBundle.rightHand,
            AssetBundle.leftHand,
            AssetBundle.gui
        ];
    }
    get loaded() {
        return this.loadedHost;
    }
    ;
    static createPath(file) {
        return `${this.assetFolder}/${file}`;
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
AssetBundle.apple = AssetBundle.createPath("Apple.png");
AssetBundle.room = AssetBundle.createPath("Room.png");
AssetBundle.town = AssetBundle.createPath("Town.png");
AssetBundle.light = AssetBundle.createPath("Light.png");
AssetBundle.playerIdleSheet = AssetBundle.createPath("PlayerIdleSheet.png");
AssetBundle.playerWalkSheet = AssetBundle.createPath("PlayerWalkSheet.png");
AssetBundle.leftHand = AssetBundle.createPath("LeftHand.png");
AssetBundle.rightHand = AssetBundle.createPath("RightHand.png");
AssetBundle.gui = AssetBundle.createPath("Gui.png");
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
class Game extends Application {
    constructor() {
        super(886, 554);
        this.state = 0;
        this.assets = new AssetBundle();
        this.renderer.backgroundColor = Color.black;
        this.assets.loaded.subscribe(this.onAssetsLoaded, this);
        this.loadingScreen = new LoadingScreen();
        this.room = new Room();
        this.root = new Widget();
        this.root.addChild(this.room);
        this.root.addChild(this.loadingScreen);
        this.renderer.imageSmoothing = false;
    }
    onAssetsLoaded() {
        this.state = 1;
        this.root.tasks.add(this.moveOutLoadingScreenTask());
    }
    *moveOutLoadingScreenTask() {
        for (let t of Task.linearMotion(0.5, 0, -this.renderer.height)) {
            this.loadingScreen.position.y = t;
            yield Wait.frame();
        }
        this.state = 2;
    }
    run() {
        super.run();
        this.assets.load();
    }
    setPixelFont(size) {
        this.renderer.context.font = `${size}px tooltipFont`;
    }
}
var game;
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
class HandItemView extends Widget {
    constructor(item) {
        super();
        this.pivot = Vector2.half;
        const sprite = item.createSprite();
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        const tooltip = new ItemTooltip(item);
        tooltip.position = this.size.divide(2).subtract(new Vector2(0, sprite.height));
        this.addChild(tooltip);
    }
}
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
        this.size.set(440, 100);
        this.pivot = Vector2.half;
        this.rightHand.position.set(this.size.x, this.size.y / 2);
        this.rightHand.tasks.add(this.handMovementTask(this.rightHand, 106));
        this.addChild(this.rightHand);
        this.leftHand.position.set(0, this.size.y / 2);
        this.leftHand.tasks.add(this.handMovementTask(this.leftHand, 108));
        this.addChild(this.leftHand);
        this.itemHolder.pivot = Vector2.half;
        this.itemHolder.position = this.size.divide(2);
        this.addChild(this.itemHolder);
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
                        if (!hand.item) {
                            if (hand.x === otherHand.x && otherHand.item && otherHand.item instanceof CompoundItem) {
                                const item = otherHand.item;
                                this.leftHand.holdItem(item.parts[0]);
                                this.rightHand.holdItem(item.parts[1]);
                            }
                            else if (this.shownItem) {
                                const item = this.shownItem;
                                hand.holdItem(item);
                                this.showItem(undefined);
                                item.onpickup();
                            }
                        }
                        else {
                            if (hand.x === otherHand.x && otherHand.item) {
                                const newItem = ItemFactory.mergeItems(this.rightHand.item, this.leftHand.item);
                                this.room.setupItem(newItem);
                                this.rightHand.holdItem(undefined);
                                this.leftHand.holdItem(newItem);
                            }
                        }
                    }
                }
            }
            yield Wait.frame();
        }
    }
}
class ItemTooltip extends GuiFrame {
    constructor(item) {
        super();
        this.nameLabel = new Label();
        this.nameLabel.text = item.name;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = Color.fromComponents(41, 196, 191);
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
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
class LoadingScreen extends Widget {
    constructor() {
        super();
        this.label = new Label();
        this.label.fontColor = Color.white;
        this.label.horizontalTextAlignment = TextAlignment.Center;
        this.label.verticalTextAlignment = TextAlignment.Center;
        this.addChild(this.label);
        this.tasks.add(this.updateLabelTask());
    }
    *updateLabelTask() {
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
    render(renderer) {
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
        this.idle = true;
        this.spriteHolder.content = this.idleSpriteSheet;
        this.idleSpriteSheet.runAnimation(this.animationName);
    }
    runWalkAnimation() {
        if (!this.idle) {
            return;
        }
        this.idle = false;
        this.spriteHolder.content = this.walkSpriteSheet;
        this.walkSpriteSheet.runAnimation(this.animationName);
    }
}
class PositionTransformer {
    constructor() {
        this.cartesianBounds = new Vector2(100, 100);
        this.obstacles = [
            new Rectangle(0, 0, 20, 38),
            new Rectangle(0, 0, 40, 20),
            new Rectangle(0, 34, 14, 60),
            new Rectangle(0, 58, 18, 102),
            new Rectangle(16, 86, 28, 102),
            new Rectangle(38, 0, 70, 10.01),
            new Rectangle(68, 0, 97, 15),
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
}
class Room extends Widget {
    constructor() {
        super();
        this.room = Sprite.fromImage(AssetBundle.room);
        this.player = new Player();
        this.transformer = new PositionTransformer();
        this.playerPosition = new Vector2(50, 50);
        this.characterSpeed = 0.30;
        this.debug = new Label();
        this.cityParallax = new CityParallax();
        this.items = [];
        this.roomObjects = new Widget();
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
        const apple = this.createItem(0);
        const apple1 = this.createItem(0);
        const apple2 = this.createItem(0);
        this.addItem(apple);
        this.addItem(apple1);
        this.addItem(apple2);
    }
    update(delta) {
        game.setPixelFont(32);
        this.updateCharacterPosition();
        this.updateItemHighlights();
        this.updateParallax();
        this.sortRoomObjects();
        super.update(delta);
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
        const pressed = controls.filter(key => game.input.isKeyPressed(key));
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
        this.debug.text = `${this.toStringV2(this.playerPosition)} ${this.toStringV2(this.player.position)}`;
        if (this.mousePosition) {
            this.debug.text += ` ${this.toStringV2(this.mousePosition)}  ${this
                .toStringV2(this.transformer.toCartesian(this.mousePosition))}`;
        }
    }
    updateItemHighlights() {
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
        this.itemHandPanel.showItem(undefined);
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
    toStringV2(vector) {
        return `${vector.x} ${vector.y}`;
    }
}
class ItemFactory {
    static mergeItems(first, second) {
        if (first instanceof SimpleItem && second instanceof SimpleItem) {
            for (let combo of this.combos) {
                const match = (first.type === combo.pair.first && second.type === combo.pair.second) ||
                    (second.type === combo.pair.first && first.type === combo.pair.second);
                if (match) {
                    return this.createItem(combo.result);
                }
            }
        }
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
                return new SimpleItem(Texture.fromImage(AssetBundle.apple), new Vector2(32, 32), "Apple");
            default:
                throw "Error creating item";
        }
    }
}
ItemFactory.combos = [];
class DisplayableObject extends Widget {
    constructor() {
        super(...arguments);
        this.onpickup = () => { };
        this.onput = () => { };
        this.oninteract = () => { };
        this.pickable = true;
    }
}
class SimpleItem extends DisplayableObject {
    constructor(texture, size, name) {
        super();
        this.image = new Sprite();
        this.cartesianPosition = new Vector2(50, 50);
        this.image.texture = texture;
        this.image.pivot = new Vector2(0.5, 1);
        this.image.size = size;
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
//# sourceMappingURL=app.js.map