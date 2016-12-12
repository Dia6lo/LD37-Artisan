class GuiFrame extends NineGrid {
    constructor() {
        super(Texture.fromImage(AssetBundle.gui));
        this.left = 4;
        this.right = 4;
        this.top = 4;
        this.bottom = 4;
    }
}