class AssetBundle {
    private loadedHost = ObservableEventHost.create<() => void>();
    get loaded(): ObservableEvent<() => void> {
        return this.loadedHost;
    };

    private static readonly assetFolder = "assets";
    static readonly apple = AssetBundle.createPath("Apple.png");
    static readonly player = AssetBundle.createPath("Player.png");
    static readonly room = AssetBundle.createPath("Room.png");
    static readonly town = AssetBundle.createPath("Town.png");
    static readonly light = AssetBundle.createPath("Light.png");
    static readonly itemHand = AssetBundle.createPath("ItemHand.png");
    private readonly imageUrls = [
        AssetBundle.apple,
        AssetBundle.player,
        AssetBundle.room,
        AssetBundle.town,
        AssetBundle.light,
        AssetBundle.itemHand
    ];

    private static createPath(file: string) {
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
