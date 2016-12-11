class WidgetHolder extends Widget {
    set content(widget: Widget) {
        const children = this.children.slice();
        for (let child of children) {
            this.removeChild(child);
        }
        this.addChild(widget);
    }
}