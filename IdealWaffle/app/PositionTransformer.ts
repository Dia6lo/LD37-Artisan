class PositionTransformer {
    cartesianBounds = new Vector2(100, 100);

    obstacles = [
        // Table (left side)
        new Rectangle(0, 0, 20, 38),
        // Table (right side)
        new Rectangle(0, 0, 40, 20),
        // Drawer
        new Rectangle(0, 34, 14, 60),
        // Bed
        new Rectangle(0, 56, 18, 102),
        // Box
        new Rectangle(16, 86, 28, 102),
        // Bookshelve
        new Rectangle(38, 0, 70, 10.01),
        // Poststand
        new Rectangle(68, 0, 97, 15.5),
        // Poststand cables
        new Rectangle(95, 0, 102, 7)
    ];

    isometricTop = new Vector2(432, 204);
    isometricBottom = new Vector2(432, 584);
    isometricLeft = new Vector2(48, 394);
    isometricRight = new Vector2(816, 394);
    isometricSliceHeight = 474;

    xModifier: number;
    yModifier: number;

    constructor() {
        this.xModifier = (this.isometricRight.x - this.isometricLeft.x) / this.cartesianBounds.x / 2;
        this.yModifier = (this.isometricBottom.y - this.isometricTop.y) / this.cartesianBounds.y / 2;
    }

    moveInCartesian(from: Vector2, to: Vector2) {
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
                let intersetingLineStart: Vector2;
                let intersetingLineEnd: Vector2;
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

    private getIntersection(v1: Vector2, v2: Vector2, v3: Vector2, v4: Vector2): Vector2 | undefined {
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

    moveInIsometric(from: Vector2, to: Vector2) {
        const result = to.clone();
        result.y = Math.clamp(result.y, this.isometricTop.y, this.isometricSliceHeight);
        return result;
    }

    isLeft(a: Vector2, b: Vector2, c: Vector2) {
        return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
    }

    toIsometric(position: Vector2) {
        const x = (position.x - position.y) * this.xModifier;
        const y = (position.x + position.y) * this.yModifier;
        return new Vector2(x, y).add(this.isometricTop);
    }

    toCartesian(position: Vector2) {
        const noOffset = position.subtract(this.isometricTop);
        const x = (noOffset.x / this.xModifier + noOffset.y / this.yModifier) / 2;
        const y = (noOffset.y / this.yModifier - noOffset.x / this.xModifier) / 2;
        return new Vector2(x, y);
    }
}