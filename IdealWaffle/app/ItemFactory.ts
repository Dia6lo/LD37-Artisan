class ItemFactory {
    private static combos: { pair: { first: ItemType; second: ItemType }; result: ItemType }[] = [
        //{ pair: { first: ItemType.Apple, second: ItemType.Apple }, result: ItemType.Apple }
    ];

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
                return new SimpleItem(Texture.fromImage(AssetBundle.apple), new Vector2(32, 32), "Apple");
            default:
                throw "Error creating item";
        }
    }
}