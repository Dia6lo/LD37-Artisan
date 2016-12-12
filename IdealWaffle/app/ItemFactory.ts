class ItemFactory {
    private static combos: { pair: { first: ItemType; second: ItemType }; result: ItemType }[] = [
        { pair: { first: ItemType.Cat, second: ItemType.Sandwich }, result: ItemType.Perpetual }
    ];

    static isItemSpecial(item: Item) {
        if (item instanceof CompoundItem) {
            return true;
        }
        const simpleItem = item as SimpleItem;
        const matches = this.combos.filter(c => c.result === simpleItem.type);
        return matches.length > 0;
    }

    static mergeItems(first: Item, second: Item): SimpleItem | CompoundItem {
        if (first instanceof SimpleItem && second instanceof SimpleItem) {
            for (let combo of this.combos) {
                const match = (first.type === combo.pair.first && second.type === combo.pair.second) ||
                    (second.type === combo.pair.first && first.type === combo.pair.second);
                if (match) {
                    return this.createItem(combo.result);
                }
            }
        }
        return new CompoundItem([first, second]);
    }

    static createItem(type: ItemType): SimpleItem {
        const item = this.getItemObject(type);
        item.type = type;
        return item;
    }

    private static getItemObject(type: ItemType) {
        switch (type) {
            case ItemType.Apple:
                return this.constructItem(AssetBundle.apple, "Apple");
            case ItemType.Bomb:
                return this.constructItem(AssetBundle.bomb, "Bomb");
            case ItemType.Boot:
                return this.constructItem(AssetBundle.boot, "Boot");
            case ItemType.Car:
                return this.constructItem(AssetBundle.car, "Car");
            case ItemType.Cat:
                return this.constructItem(AssetBundle.cat, "Cat");
            case ItemType.Chip:
                return this.constructItem(AssetBundle.chip, "Chip");
            case ItemType.Clock:
                return this.constructItem(AssetBundle.clock, "Clock");
            case ItemType.Club:
                return this.constructItem(AssetBundle.club, "Club");
            case ItemType.Dinner:
                return this.constructItem(AssetBundle.dinner, "Dinner");
            case ItemType.FlameThrower:
                return this.constructItem(AssetBundle.flameThrower, "Flamethrower");
            case ItemType.Flashlight:
                return this.constructItem(AssetBundle.flashlight, "Flashlight");
            case ItemType.Glass:
                return this.constructItem(AssetBundle.glass, "Glass");
            case ItemType.Glasses:
                return this.constructItem(AssetBundle.glasses, "Glasses");
            case ItemType.Leg:
                return this.constructItem(AssetBundle.leg, "Leg");
            case ItemType.Lighter:
                return this.constructItem(AssetBundle.lighter, "Lighter");
            case ItemType.Pen:
                return this.constructItem(AssetBundle.pen, "Pen");
            case ItemType.Perpetual:
                return this.constructItem(AssetBundle.perpetual, "Perpetual Motion Machine");
            case ItemType.Pipe:
                return this.constructItem(AssetBundle.pipe, "Pipe");
            case ItemType.Robot:
                return this.constructItem(AssetBundle.robot, "Robot");
            case ItemType.Roller:
                return this.constructItem(AssetBundle.roller, "Roller Skates");
            case ItemType.Sandwich:
                return this.constructItem(AssetBundle.sandwich, "Sandwich");
            case ItemType.Smoke:
                return this.constructItem(AssetBundle.smoke, "Smoke Grenade");
            case ItemType.Spyglass:
                return this.constructItem(AssetBundle.spyglass, "Spyglass");
            case ItemType.TimeMachine:
                return this.constructItem(AssetBundle.timeMachine, "Time Machine");
            case ItemType.Unicorn:
                return this.constructItem(AssetBundle.unicorn, "Unicorn");
            case ItemType.Pineapple:
                return this.constructItem(AssetBundle.pineapple, "Pineapple");
            default:
                throw "Error creating item";
        }
    }

    private static constructItem(path: string, tooltip: string) {
        return new SimpleItem(Texture.fromImage(path), tooltip);
    }
}