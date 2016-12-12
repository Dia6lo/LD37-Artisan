/// <reference path="PanelObjectView.ts"/>
class HandItemView extends PanelObjectView {
    constructor(item: Item) {
        super(item.createSprite(), item.name);
    }
}