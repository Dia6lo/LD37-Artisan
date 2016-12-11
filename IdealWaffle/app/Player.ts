/// <reference path="WidgetHolder.ts"/>
class Player extends Widget {
    private idleSpriteSheet = Spritesheet.fromImage(AssetBundle.playerIdleSheet);
    private walkSpriteSheet = Spritesheet.fromImage(AssetBundle.playerWalkSheet);
    private readonly widgetSize = new Vector2(40, 130);
    private readonly spriteSize = new Vector2(20, 65);
    private idle;
    private spriteHolder = new WidgetHolder();
    private readonly animationName = "Animation";

    constructor() {
        super();
        this.setupAnimation(this.idleSpriteSheet, 4, 15);
        this.setupAnimation(this.walkSpriteSheet, 8, 12);
        this.runIdleAnimation();
        this.addChild(this.spriteHolder);

    }

    private setupAnimation(spritesheet: Spritesheet, frameCount: number, frameDelay: number) {
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