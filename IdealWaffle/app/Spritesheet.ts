class Spritesheet extends Widget {
    spriteSize = Vector2.zero;
    spriteId = 0;

    constructor(public texture?: Texture) {
        super();
    }

    static fromImage(url: string): Spritesheet {
        return new Spritesheet(Texture.fromImage(url));
    }

    render(renderer: Renderer): void {
        renderer.renderTexture(this.texture, 0, 0, this.size.x, this.size.y,
            this.spriteSize.x * this.spriteId, 0, this.spriteSize.x, this.spriteSize.y);
        super.render(renderer);
    }

    static spriteIdAnimator = () => new NumberAnimator("spriteId");
}