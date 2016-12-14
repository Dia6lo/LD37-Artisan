/// <reference path="WidgetHolder.ts"/>
class Player extends Widget {
    private idleSpriteSheet = Spritesheet.fromImage(AssetBundle.playerIdleSheet);
    private walkSpriteSheet = Spritesheet.fromImage(AssetBundle.playerWalkSheet);
    private readonly widgetSize = new Vector2(40, 118);
    private readonly spriteSize = new Vector2(20, 59);
    private idle;
    private spriteHolder = new WidgetHolder();
    private readonly animationName = "Animation";
    private stepSound = game.audio.play("assets/steps.mp3", true, 0);

    constructor() {
        super();
        this.size = this.widgetSize;
        this.setupAnimation(this.idleSpriteSheet, 4, 15);
        this.setupAnimation(this.walkSpriteSheet, 8, 8);
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