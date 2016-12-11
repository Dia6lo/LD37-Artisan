class WidgetHolder extends Widget {
    get content(): Widget {
        return this.children[0];
    }

    set content(widget: Widget) {
        const children = this.children.slice();
        for (let child of children) {
            this.removeChild(child);
        }
        this.addChild(widget);
    }
}