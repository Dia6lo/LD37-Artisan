class WidgetHolder extends Widget {
    get content(): Widget {
        return this.children[0];
    }

    set content(widget: Widget) {
        this.clear();
        this.addChild(widget);
    }

    clear() {
        const children = this.children.slice();
        for (let child of children) {
            this.removeChild(child);
        }
    }
}