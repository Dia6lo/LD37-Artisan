class CityParallax extends Widget {
    private readonly texture = Texture.fromImage("assets/Town.png");
    private readonly clipSize = new Vector2(136, 56);
    private readonly parallaxSize = new Vector2(39, 10);
    private readonly clipStartOffset = new Vector2(19.5, 5);
    offset = Vector2.zero;

    constructor() {
        super();
    }

    render(renderer: Renderer): void {
        const clipStart = this.offset.multiply(this.parallaxSize);
        renderer.renderTexture(this.texture, 0, 0, this.clipSize.x * 2, this.clipSize.y * 2,
            this.clipStartOffset.x + clipStart.x, this.clipStartOffset.y + clipStart.y, this.clipSize.x, this.clipSize.y);
    }
}