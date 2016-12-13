class AssetBundle {
    private loadedHost = ObservableEventHost.create<() => void>();
    get loaded(): ObservableEvent<() => void> {
        return this.loadedHost;
    };

    private static readonly assetFolder = "assets";
    static readonly room = AssetBundle.createPath("Room.png");
    static readonly room2 = AssetBundle.createPath("Room2.png");
    static readonly town = AssetBundle.createPath("Town.png");
    static readonly light = AssetBundle.createPath("Light.png");
    static readonly playerIdleSheet = AssetBundle.createPath("PlayerIdleSheet.png");
    static readonly playerWalkSheet = AssetBundle.createPath("PlayerWalkSheet.png");
    static readonly leftHand = AssetBundle.createPath("LeftHand.png");
    static readonly rightHand = AssetBundle.createPath("RightHand.png");
    static readonly gui = AssetBundle.createPath("Gui.png");
    static readonly marker = AssetBundle.createPath("Marker.png");
    static readonly watchTv = AssetBundle.createPath("WatchTV.png");
    static readonly sleep = AssetBundle.createPath("Sleep.png");
    static readonly send = AssetBundle.createPath("Send.png");
    static readonly piece = AssetBundle.createPath("Piece.png");
    static readonly craft = AssetBundle.createPath("CraftBody.png");
    static readonly arrow = AssetBundle.createPath("Arrow.png");
    static readonly armor = AssetBundle.createPath("Armor.png");

    // Faces
    static readonly boss = AssetBundle.createPath("Boss.png");
    static readonly goverment = AssetBundle.createPath("Goverment.png");
    static readonly hero = AssetBundle.createPath("Hero.png");
    static readonly secretMan = AssetBundle.createPath("SecretMan.png");
    static readonly verySecretMan = AssetBundle.createPath("VerySecretMan.png");
    static readonly western = AssetBundle.createPath("Western.png");
    static readonly folk = AssetBundle.createPath("Folk.png");

    // Items
    static readonly apple = AssetBundle.createItemPath("Apple.png");
    static readonly bomb = AssetBundle.createItemPath("Bomb.png");
    static readonly boot = AssetBundle.createItemPath("Boot.png");
    static readonly car = AssetBundle.createItemPath("Car.png");
    static readonly cat = AssetBundle.createItemPath("Cat.png");
    static readonly chip = AssetBundle.createItemPath("Chip.png");
    static readonly clock = AssetBundle.createItemPath("Clock.png");
    static readonly club = AssetBundle.createItemPath("Club.png");
    static readonly dinner = AssetBundle.createItemPath("Dinner.png");
    static readonly flameThrower = AssetBundle.createItemPath("FlameThrower.png");
    static readonly flashlight = AssetBundle.createItemPath("Flashlight.png");
    static readonly glass = AssetBundle.createItemPath("Glass.png");
    static readonly glasses = AssetBundle.createItemPath("Glasses.png");
    static readonly leg = AssetBundle.createItemPath("Leg.png");
    static readonly lighter = AssetBundle.createItemPath("Lighter.png");
    static readonly pen = AssetBundle.createItemPath("Pen.png");
    static readonly perpetual = AssetBundle.createItemPath("Perpetual.png");
    static readonly pipe = AssetBundle.createItemPath("Pipe.png");
    static readonly robot = AssetBundle.createItemPath("Robot.png");
    static readonly roller = AssetBundle.createItemPath("Roller.png");
    static readonly sandwich = AssetBundle.createItemPath("Sandwich.png");
    static readonly smoke = AssetBundle.createItemPath("Smoke.png");
    static readonly spyglass = AssetBundle.createItemPath("Spyglass.png");
    static readonly timeMachine = AssetBundle.createItemPath("TimeMachine.png");
    static readonly unicorn = AssetBundle.createItemPath("Unicorn.png");
    static readonly pineapple = AssetBundle.createItemPath("Pineapple.png");

    private readonly imageUrls = [
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

    private static createPath(file: string) {
        return `${this.assetFolder}/${file}`;
    }

    private static createItemPath(file: string) {
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
