class AssetBundle {
    private loadedHost = ObservableEventHost.create<() => void>();
    get loaded(): ObservableEvent<() => void> {
        return this.loadedHost;
    };

    private static readonly assetFolder = "assets";
    static readonly apple = AssetBundle.createPath("Apple.png");
    static readonly room = AssetBundle.createPath("Room.png");
    static readonly town = AssetBundle.createPath("Town.png");
    static readonly light = AssetBundle.createPath("Light.png");
    static readonly itemHand = AssetBundle.createPath("ItemHand.png");
    static readonly playerSheet = AssetBundle.createPath("Player_sheet.png");
    private readonly imageUrls = [
        AssetBundle.apple,
        AssetBundle.room,
        AssetBundle.town,
        AssetBundle.light,
        AssetBundle.itemHand,
        AssetBundle.playerSheet
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
