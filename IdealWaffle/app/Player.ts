class Player extends Widget {
    private spriteSheet = Spritesheet.fromImage(AssetBundle.playerSheet);

    constructor() {
        super();
        this.spriteSheet.size.set(40, 130);
        this.spriteSheet.spriteSize.set(20, 65);
        const idleAnimation = new Animation(60);
        idleAnimation.finalAction = Animation.loop();
        const spriteIdAnimator = Spritesheet.spriteIdAnimator();
        spriteIdAnimator.setFrame(0, 0);
        spriteIdAnimator.setFrame(15, 1);
        spriteIdAnimator.setFrame(30, 2);
        spriteIdAnimator.setFrame(45, 3);
        idleAnimation.setAnimator(spriteIdAnimator);
        this.spriteSheet.animations.set("Idle", idleAnimation);
        this.addChild(this.spriteSheet);
        this.spriteSheet.runAnimation("Idle");
    }
}