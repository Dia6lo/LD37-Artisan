class Application {
    constructor(width = 800, height = 600) {
        this.fps = 0;
        this.view = document.createElement("div");
        this.renderer = new Renderer(width, height);
        this.view.appendChild(this.renderer.view);
        this.audio = new AudioPlayer();
        this.view.appendChild(this.audio.view);
        this.input = new Input();
    }
    run() {
        window.requestAnimationFrame((time) => this.handleAnimationFrame(time));
        window.onkeydown = event => this.onKeyDown(event);
        window.onkeyup = event => this.onKeyUp(event);
    }
    onKeyDown(event) {
        this.input.addKeyEvent(this.translateKey(event.code), true);
    }
    onKeyUp(event) {
        this.input.addKeyEvent(this.translateKey(event.code), false);
    }
    handleAnimationFrame(time) {
        if (!this.time) {
            this.time = time;
        }
        const delta = (time - this.time) / 1000;
        this.fps = 1 / delta;
        this.input.processPendingKeyEvents();
        this.update(delta);
        this.render();
        this.time = time;
        window.requestAnimationFrame((t) => this.handleAnimationFrame(t));
    }
    render() {
        this.renderer.flush();
        if (this.root) {
            this.renderer.render(this.root);
        }
    }
    update(delta) {
        if (this.root) {
            this.root.update(delta);
        }
    }
    translateKey(code) {
        switch (code) {
            case "ArrowUp":
                return 45;
            case "ArrowDown":
                return 46;
            case "ArrowRight":
                return 48;
            case "ArrowLeft":
                return 47;
            case "Space":
                return 51;
            case "KeyZ":
                return 108;
            case "KeyX":
                return 106;
            default:
                return 0;
        }
    }
}
class AudioPlayer {
    constructor() {
        this.audioElements = [];
        this.freeAudioElements = [];
        this.view = document.createElement("div");
    }
    play(source, loop = false, volume = 1) {
        let audioElement;
        if (!this.freeAudioElements.any()) {
            this.freeAudioElements = this.audioElements.filter(e => e.paused);
        }
        if (!this.freeAudioElements.any()) {
            audioElement = document.createElement("audio");
            this.audioElements.push(audioElement);
            this.view.appendChild(audioElement);
        }
        else {
            audioElement = this.freeAudioElements.pop();
        }
        audioElement.src = source;
        audioElement.loop = loop;
        audioElement.volume = volume;
        audioElement.play();
        return audioElement;
    }
}
class EventObserver {
    constructor(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once;
    }
    execute(dispatcher) {
        const fn = this.fn.bind(this.context);
        dispatcher(fn);
        this.needsRemoval = this.once;
    }
}
class ObservableEventHost {
    constructor() {
        this.observers = [];
    }
    dispatch(dispatcher) {
        for (let i = this.observers.length - 1; i >= 0; i--) {
            this.observers[i].execute(dispatcher);
        }
        this.observers = this.observers.filter(value => !value.needsRemoval);
    }
    subscribe(fn, context) {
        this.addObserver(fn, context, false);
    }
    subscribeOnce(fn, context) {
        this.addObserver(fn, context, true);
    }
    addObserver(fn, context, once) {
        if (!this.observers) {
            this.observers = [];
        }
        const observer = new EventObserver(fn, context, once);
        this.observers.push(observer);
    }
    remove(fn) {
        if (!this.observers) {
            return;
        }
        this.observers = this.observers.filter(value => value.fn !== fn);
    }
    removeAll() {
        this.observers = [];
    }
    static create() {
        return new ObservableEventHost();
    }
}
if (!Array.prototype.last) {
    Array.prototype.last = function (filter) {
        if (this.length === 0) {
            throw "Array contains no elements";
        }
        let last;
        if (filter) {
            const filtered = this.filter(filter);
            if (filtered.length === 0) {
                throw "Array contains no matching element";
            }
            last = filtered[filtered.length - 1];
        }
        else {
            last = this[this.length - 1];
        }
        return last;
    };
}
;
if (!Array.prototype.lastOrDefault) {
    Array.prototype.lastOrDefault = function (filter) {
        try {
            return this.last(filter);
        }
        catch (e) {
            return undefined;
        }
    };
}
;
if (!Array.prototype.first) {
    Array.prototype.first = function (filter) {
        if (this.length === 0) {
            throw "Array contains no elements";
        }
        if (filter) {
            const filtered = this.filter(filter);
            if (filtered.length === 0) {
                throw "Array contains no matching element";
            }
            return filtered[0];
        }
        return this[0];
    };
}
;
if (!Array.prototype.firstOrDefault) {
    Array.prototype.firstOrDefault = function (filter) {
        try {
            return this.first(filter);
        }
        catch (e) {
            return undefined;
        }
    };
}
;
if (!Array.prototype.any) {
    Array.prototype.any = function () { return this.length > 0; };
}
;
Math.lerp = (amount, from, to) => from + (to - from) * amount;
Math.clamp = (value, min, max) => (value < min) ? min : (value > max ? max : value);
Math.HALFPI = Math.PI / 2;
class Input {
    constructor() {
        this.previousKeyState = [];
        this.currentKeyState = [];
        this.keyEventQueue = [];
    }
    isKeyPressed(key) {
        return this.currentKeyState[key];
    }
    wasKeyPressed(key) {
        return this.currentKeyState[key] && !this.previousKeyState[key];
    }
    wasKeyReleased(key) {
        return !this.currentKeyState[key] && this.previousKeyState[key];
    }
    addKeyEvent(key, down) {
        this.keyEventQueue.push({ key: key, down: down });
    }
    processPendingKeyEvents() {
        let keyEventQueue = this.keyEventQueue;
        this.keyEventQueue = [];
        keyEventQueue = keyEventQueue.reverse();
        this.previousKeyState = this.currentKeyState.slice();
        while (keyEventQueue.length > 0) {
            const event = keyEventQueue.pop();
            this.currentKeyState[event.key] = event.down;
        }
    }
}
class Mechanism {
    static helloWorld() {
        console.debug(`Mechanism ${this.version}`);
    }
}
Mechanism.version = "1.0.0";
class Renderer {
    constructor(width, height) {
        const canvas = document.createElement("canvas");
        this.view = canvas;
        const context = canvas.getContext("2d");
        if (!context) {
            throw "Cannot obtain context";
        }
        this.context = context;
        this.width = width;
        this.height = height;
        context.font = "30px sans-serif";
        this.vectorGraphics = new VectorGraphics(this.context);
    }
    get width() {
        return this.view.clientWidth;
    }
    set width(value) {
        this.view.width = value;
    }
    get height() {
        return this.view.clientHeight;
    }
    set height(value) {
        this.view.height = value;
    }
    get size() {
        return new Vector2(this.width, this.height);
    }
    set size(value) {
        this.width = value.x;
        this.height = value.y;
    }
    set imageSmoothing(value) {
        const ctx = this.context;
        ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled =
            ctx.msImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
    }
    get globalAlpha() {
        return this.context.globalAlpha;
    }
    set globalAlpha(value) {
        this.context.globalAlpha = value;
    }
    render(renderObject) {
        renderObject.beforeRender(this);
        renderObject.render(this);
        renderObject.afterRender(this);
    }
    renderTexture(texture, x = 0, y = 0, width, height, sx, sy, sWidth, sHeight) {
        if (!texture || !texture.source) {
            this.renderUndefinedTexture(x, y, width, height);
        }
        else {
            if (arguments.length <= 5) {
                this.context.drawImage(texture.source, x, y, width, height);
            }
            else {
                this.context.drawImage(texture.source, sx, sy, sWidth, sHeight, x, y, width, height);
            }
        }
    }
    renderText(text, x = 0, y = 0, color) {
        this.save();
        if (color) {
            this.vectorGraphics.fillStyle(color);
        }
        this.context.fillText(text, x, y);
        this.restore();
    }
    measureText(text) {
        return this.context.measureText(text).width;
    }
    renderUndefinedTexture(x = 0, y = 0, width, height) {
        const image = new Image();
        image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAG0lEQVQI12O4yTDl////WEkGXBL///9nGAb6AKuosf7WkzVAAAAAAElFTkSuQmCC";
        const ctx = this.context;
        const smoothings = [
            ctx.mozImageSmoothingEnabled, ctx.webkitImageSmoothingEnabled,
            ctx.msImageSmoothingEnabled, ctx.imageSmoothingEnabled
        ];
        this.imageSmoothing = false;
        ctx.drawImage(image, x, y, width, height);
        [ctx.mozImageSmoothingEnabled, ctx.webkitImageSmoothingEnabled,
            ctx.msImageSmoothingEnabled, ctx.imageSmoothingEnabled] = smoothings;
    }
    translate(x, y) {
        this.context.translate(x, y);
    }
    rotate(angle) {
        const radians = (Math.PI / 180) * angle;
        this.context.rotate(radians);
    }
    scale(x, y) {
        this.context.scale(x, y);
    }
    save() {
        this.context.save();
    }
    restore() {
        this.context.restore();
    }
    clip(x, y, width, height) {
        const path = new Path2D();
        path.rect(x, y, width, height);
        this.context.clip(path);
    }
    flush() {
        this.context.save();
        if (this.backgroundColor) {
            this.context.fillStyle = this.backgroundColor.toCssHex();
            this.context.fillRect(0, 0, this.width, this.height);
        }
        else {
            this.context.clearRect(0, 0, this.width, this.height);
        }
        this.context.restore();
    }
}
class Animation {
    constructor(frameCount) {
        this.frameCount = frameCount;
        this.animators = {};
        this.currentFrame = 0;
        this.animationEndedHost = ObservableEventHost.create();
    }
    get animationEnded() {
        return this.animationEndedHost;
    }
    ;
    run(frame = 0) {
        this.currentFrame = frame;
        this.isRunning = true;
    }
    setAnimator(animator) {
        this.animators[animator.name] = animator;
    }
    advance(frameCount, object) {
        const nextFrame = this.currentFrame + frameCount;
        const animators = this.animators;
        for (let animatorName in animators) {
            if (animators.hasOwnProperty(animatorName)) {
                animators[animatorName].apply(object, nextFrame);
            }
        }
        this.currentFrame = nextFrame;
        if (this.frameCount === nextFrame) {
            this.isRunning = false;
            this.animationEndedHost.dispatch(fn => fn());
            return this.finalAction;
        }
        return undefined;
    }
    static loop(frame = 0) {
        return new FinalAnimationAction(frame);
    }
    static goto(frame = 0, animation) {
        return new FinalAnimationAction(frame, animation);
    }
}
class AnimationCollection {
    constructor() {
        this.animations = {};
    }
    set(name, animation) {
        if (this.animations.hasOwnProperty(name)) {
            throw "Animation with this name has been added already";
        }
        this.animations[name] = animation;
    }
    get(name) {
        if (!this.animations.hasOwnProperty(name)) {
            throw "Animation with this name hasn't been added";
        }
        return this.animations[name];
    }
    tryGet(name) {
        return this.animations[name];
    }
}
class Animator {
    constructor(name) {
        this.name = name;
        this.frames = [];
    }
    apply(object, frame) {
        const lastFrame = this.frames.lastOrDefault((element, index) => index <= frame);
        if (!lastFrame) {
            return;
        }
        if (lastFrame.interpolation === Interpolation.None) {
            this.applyValue(object, lastFrame.value);
            return;
        }
        const nextFrame = this.frames.firstOrDefault((element, index) => index > frame);
        if (!nextFrame) {
            this.applyValue(object, lastFrame.value);
            return;
        }
        const lastIndex = this.frames.indexOf(lastFrame);
        const nextIndex = this.frames.indexOf(nextFrame);
        const amount = (frame - lastIndex) / (nextIndex - lastIndex);
        const interpolatedValue = this.interpolate(amount, lastFrame.value, nextFrame.value, lastFrame.interpolation);
        this.applyValue(object, interpolatedValue);
    }
}
class GenericAnimator extends Animator {
    constructor(name) {
        super(name);
        this.frames = [];
    }
    setFrame(frame, value, interpolation = Interpolation.None) {
        this.frames[frame] = new KeyFrame(value, interpolation);
    }
    applyValue(object, value) {
        object[this.name] = value;
    }
    interpolate(amount, from, to, interpolation) {
        return from;
    }
}
class Vector2Animator extends GenericAnimator {
    interpolate(amount, from, to, interpolation) {
        switch (interpolation) {
            case Interpolation.Linear:
                return new Vector2(Math.lerp(amount, from.x, to.x), Math.lerp(amount, from.y, to.y));
            default:
                throw "Not supported";
        }
    }
}
class NumberAnimator extends GenericAnimator {
    interpolate(amount, from, to, interpolation) {
        switch (interpolation) {
            case Interpolation.Linear:
                return Math.lerp(amount, from, to);
            default:
                throw "Not supported";
        }
    }
}
class FinalAnimationAction {
    constructor(frame, animation) {
        this.frame = frame;
        this.animation = animation;
    }
}
var Interpolation;
(function (Interpolation) {
    Interpolation[Interpolation["None"] = 0] = "None";
    Interpolation[Interpolation["Linear"] = 1] = "Linear";
})(Interpolation || (Interpolation = {}));
class KeyFrame {
    constructor(value, interpolation = Interpolation.None) {
        this.value = value;
        this.interpolation = interpolation;
    }
}
class RenderObject {
    constructor() {
        this.children = [];
        this.animations = new AnimationCollection();
        this.tasks = new TaskList();
    }
    addChild(container) {
        this.children.push(container);
        container.parent = this;
    }
    removeChild(container) {
        const index = this.children.indexOf(container);
        if (index === -1) {
            return false;
        }
        this.children.splice(index, 1);
        container.parent = undefined;
        return true;
    }
    removeFromParent() {
        if (!this.parent) {
            return;
        }
        this.parent.removeChild(this);
    }
    render(renderer) {
        for (let child of this.children) {
            renderer.render(child);
        }
    }
    beforeRender(renderer) { }
    afterRender(renderer) { }
    update(delta) {
        if (this.currentAnimation) {
            const goto = this.currentAnimation.advance(1, this);
            if (goto) {
                if (goto.animation) {
                    this.runAnimation(goto.animation, goto.frame);
                }
                else {
                    this.currentAnimation.run(goto.frame);
                }
            }
        }
        this.tasks.update(delta);
        for (let child of this.children) {
            child.update(delta);
        }
    }
    runAnimation(name, frame = 0) {
        this.currentAnimation = this.animations.get(name);
        this.currentAnimation.run(frame);
    }
    tryRunAnimation(name, frame = 0) {
        const animation = this.animations.tryGet(name);
        if (animation) {
            this.currentAnimation = animation;
            this.currentAnimation.run(frame);
        }
    }
    runChildAnimation(name) {
        for (let child of this.children) {
            child.tryRunAnimation(name);
        }
    }
}
class Widget extends RenderObject {
    constructor() {
        super(...arguments);
        this.children = [];
        this.position = Vector2.zero;
        this.scale = Vector2.one;
        this.rotation = 0;
        this.pivot = Vector2.zero;
        this.size = new Vector2(100, 100);
        this.opacity = 1;
        this.visible = true;
    }
    beforeRender(renderer) {
        if (!this.visible) {
            return;
        }
        renderer.save();
        renderer.globalAlpha *= this.opacity;
        renderer.translate(this.position.x, this.position.y);
        renderer.rotate(this.rotation);
        renderer.scale(this.scale.x, this.scale.y);
        const offset = this.pivot
            .multiply(new Vector2(this.width, this.height));
        renderer.translate(-offset.x, -offset.y);
    }
    afterRender(renderer) {
        renderer.restore();
    }
    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
    }
    get width() {
        return this.size.x;
    }
    set width(value) {
        this.size.x = value;
    }
    get height() {
        return this.size.y;
    }
    set height(value) {
        this.size.y = value;
    }
    addChild(widget) {
        super.addChild(widget);
    }
}
Widget.positionAnimator = () => new Vector2Animator("position");
Widget.scaleAnimator = () => new Vector2Animator("scale");
Widget.pivotAnimator = () => new Vector2Animator("pivot");
Widget.sizeAnimator = () => new Vector2Animator("size");
Widget.rotationAnimator = () => new NumberAnimator("rotation");
class Label extends Widget {
    constructor(text) {
        super();
        this.text = text;
        this.verticalTextAlignment = TextAlignment.Start;
        this.horizontalTextAlignment = TextAlignment.Start;
    }
    render(renderer) {
        if (!this.text) {
            super.render(renderer);
            return;
        }
        const measure = new Vector2(renderer.measureText(this.text), 30);
        const position = Vector2.zero;
        switch (this.horizontalTextAlignment) {
            case TextAlignment.Center:
                position.x = this.size.x / 2 - measure.x / 2;
                break;
            case TextAlignment.End:
                position.x = this.size.x - measure.x;
                break;
        }
        switch (this.verticalTextAlignment) {
            case TextAlignment.Start:
                position.y = measure.y;
                break;
            case TextAlignment.Center:
                position.y = this.size.y / 2 + measure.y / 2;
                break;
            case TextAlignment.End:
                position.y = this.size.y;
                break;
        }
        renderer.renderText(this.text, position.x, position.y, this.fontColor);
        super.render(renderer);
    }
}
class NineGrid extends Widget {
    constructor(texture) {
        super();
        this.texture = texture;
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }
    render(renderer) {
        renderer.save();
        for (let part of this.getParts()) {
            renderer.renderTexture(this.texture, part.target.left, part.target.top, part.target.width, part.target.height, part.crop.left, part.crop.top, part.crop.width, part.crop.height);
        }
        renderer.restore();
        super.render(renderer);
    }
    getParts() {
        let parts = [];
        let textureSize;
        if (this.texture) {
            textureSize = this.texture.size;
        }
        else {
            textureSize = this.size;
        }
        const innerCrop = new Rectangle(this.left, this.top, textureSize.x - this.right, textureSize.y - this.bottom);
        const cropMax = new Vector2(textureSize.x, textureSize.y);
        const innerTarget = new Rectangle(this.left, this.top, this.width - this.right, this.height - this.bottom);
        const targetMax = new Vector2(this.width, this.height);
        const getPart = (getCoordinates) => {
            return {
                target: getCoordinates(innerTarget, targetMax),
                crop: getCoordinates(innerCrop, cropMax)
            };
        };
        parts[0] = getPart((source, max) => new Rectangle(0, 0, source.left, source.top));
        parts[1] = getPart((source, max) => new Rectangle(source.left, 0, source.right, source.top));
        parts[2] = getPart((source, max) => new Rectangle(source.right, 0, max.x, source.left));
        parts[3] = getPart((source, max) => new Rectangle(0, source.top, source.left, source.bottom));
        parts[4] = getPart((source, max) => new Rectangle(source.left, source.top, source.right, source.bottom));
        parts[5] = getPart((source, max) => new Rectangle(source.right, source.top, max.x, source.bottom));
        parts[6] = getPart((source, max) => new Rectangle(0, source.bottom, source.left, max.y));
        parts[7] = getPart((source, max) => new Rectangle(source.left, source.bottom, source.right, max.y));
        parts[8] = getPart((source, max) => new Rectangle(source.right, source.bottom, max.x, max.y));
        parts = parts.filter(value => value.target.width > 0 && value.target.height > 0);
        return parts;
    }
}
class Sprite extends Widget {
    constructor(texture) {
        super();
        this.texture = texture;
    }
    static fromImage(url) {
        return new Sprite(Texture.fromImage(url));
    }
    render(renderer) {
        renderer.renderTexture(this.texture, 0, 0, this.size.x, this.size.y);
        super.render(renderer);
    }
}
Sprite.textureAnimator = () => new GenericAnimator("texture");
class Task {
    constructor(iterator) {
        this.iterator = iterator;
        this.totalTime = 0;
        this.delta = 0;
    }
    update(delta) {
        if (this.completed) {
            return;
        }
        this.delta = delta;
        this.totalTime += delta;
        const savedCurrent = Task.current;
        Task.current = this;
        const predicate = this.waitPredicate;
        if (predicate) {
            predicate.totalTime += delta;
            if (predicate instanceof TaskWaitPredicate) {
                predicate.task.update(delta);
            }
            if (predicate.evaluate()) {
                this.waitPredicate = undefined;
            }
            else {
                Task.current = savedCurrent;
                return;
            }
        }
        const next = this.iterator.next();
        if (next.done) {
            this.completed = true;
        }
        else {
            this.waitPredicate = next.value;
        }
        Task.current = savedCurrent;
    }
    processWaitPredicate(delta) {
        const predicate = this.waitPredicate;
        if (!predicate) {
            return false;
        }
        predicate.totalTime += delta;
        if (predicate instanceof TaskWaitPredicate) {
            predicate.task.update(delta);
        }
        const predicateCompleted = predicate.evaluate();
        if (predicateCompleted) {
            this.waitPredicate = undefined;
        }
        return !predicateCompleted;
    }
    static *sineMotion(timePeriod, from, to) {
        for (let t of this.motion(timePeriod, from, to, fraction => Math.sin(fraction * Math.HALFPI))) {
            yield t;
        }
    }
    static *sqrtMotion(timePeriod, from, to) {
        for (let t of this.motion(timePeriod, from, to, fraction => Math.sqrt(fraction))) {
            yield t;
        }
    }
    static *linearMotion(timePeriod, from, to) {
        for (let t of this.motion(timePeriod, from, to, fraction => fraction)) {
            yield t;
        }
    }
    static *motion(timePeriod, from, to, fn) {
        for (let t = 0; t < timePeriod; t += Task.current.delta) {
            yield Math.lerp(fn(t / timePeriod), from, to);
        }
        yield to;
    }
}
class TaskList {
    get length() {
        return this.tasks ? this.tasks.length : 0;
    }
    add(task) {
        if (!this.tasks) {
            this.tasks = [];
        }
        if (task instanceof Task) {
            this.tasks.push(task);
            return;
        }
        this.tasks.push(new Task(task));
    }
    update(delta) {
        if (!this.tasks || this.tasks.length === 0) {
            return;
        }
        const savedCurrent = TaskList.current;
        TaskList.current = this;
        for (let task of this.tasks) {
            task.update(delta);
        }
        this.tasks = this.tasks.filter(task => !task.completed);
        TaskList.current = savedCurrent;
    }
}
class Wait {
    static seconds(seconds) {
        const waitPredicate = new TimeWaitPredicate();
        waitPredicate.waitTime = seconds;
        return waitPredicate;
    }
    static frame() {
        return new FrameWaitPredicate();
    }
    static task(task) {
        const waitPredicate = new TaskWaitPredicate();
        waitPredicate.task = new Task(task);
        return waitPredicate;
    }
    static while(predicate) {
        const waitPredicate = new BooleanWaitPredicate();
        waitPredicate.predicate = predicate;
        return waitPredicate;
    }
    static animation(renderObject) {
        const waitPredicate = new AnimationWaitPredicate();
        waitPredicate.renderObject = renderObject;
        return waitPredicate;
    }
}
class WaitPredicate {
    constructor() {
        this.totalTime = 0;
    }
}
class AnimationWaitPredicate extends WaitPredicate {
    evaluate() {
        return this.renderObject.currentAnimation.isRunning;
    }
}
class BooleanWaitPredicate extends WaitPredicate {
    evaluate() {
        return this.predicate(this.totalTime);
    }
}
class TimeWaitPredicate extends WaitPredicate {
    constructor() {
        super(...arguments);
        this.waitTime = 0;
    }
    evaluate() {
        return this.totalTime >= this.waitTime;
    }
}
class TaskWaitPredicate extends WaitPredicate {
    evaluate() {
        return this.task.completed;
    }
}
class FrameWaitPredicate extends WaitPredicate {
    evaluate() {
        return true;
    }
}
var TextAlignment;
(function (TextAlignment) {
    TextAlignment[TextAlignment["Start"] = 0] = "Start";
    TextAlignment[TextAlignment["Center"] = 1] = "Center";
    TextAlignment[TextAlignment["End"] = 2] = "End";
})(TextAlignment || (TextAlignment = {}));
class Texture {
    constructor(source) {
        this.source = source;
    }
    static fromImage(url) {
        const image = new Image();
        const texture = new Texture(image);
        image.src = url;
        image.onerror = () => { texture.source = undefined; };
        return texture;
    }
    get size() {
        return new Vector2(this.width, this.height);
    }
    get width() {
        return this.source ? this.source.naturalWidth : 0;
    }
    get height() {
        return this.source ? this.source.naturalHeight : 0;
    }
}
class Color {
    constructor(color) {
        if (typeof color === "number") {
            this.hex = color.toString(16);
        }
        else {
            this.hex = color;
        }
    }
    get r() {
        return parseInt(this.hex.substring(0, 2), 16);
    }
    get g() {
        return parseInt(this.hex.substring(2, 4), 16);
    }
    get b() {
        return parseInt(this.hex.substring(4, 6), 16);
    }
    toHex() {
        return this.hex;
    }
    toInt() {
        return parseInt(this.hex, 16);
    }
    toCssHex() {
        const hex = "000000".substr(0, 6 - this.hex.length) + this.hex;
        return `#${hex}`;
    }
    static fromComponents(r, g, b) {
        return new Color((r << 16) + (g << 8) + b);
    }
}
Color.black = new Color(0x000000);
Color.silver = new Color(0xc0c0c0);
Color.gray = new Color(0x808080);
Color.white = new Color(0xffffff);
Color.maroon = new Color(0x800000);
Color.red = new Color(0xff0000);
Color.purple = new Color(0x800080);
Color.fuchsia = new Color(0xff00ff);
Color.green = new Color(0x008000);
Color.lime = new Color(0x00ff00);
Color.olive = new Color(0x808000);
Color.yellow = new Color(0xffff00);
Color.navy = new Color(0x000080);
Color.blue = new Color(0x0000ff);
Color.teal = new Color(0x008080);
Color.aqua = new Color(0x00ffff);
Color.orange = new Color(0xffa500);
Color.aliceblue = new Color(0xf0f8ff);
Color.antiquewhite = new Color(0xfaebd7);
Color.aquamarine = new Color(0x7fffd4);
Color.azure = new Color(0xf0ffff);
Color.beige = new Color(0xf5f5dc);
Color.bisque = new Color(0xffe4c4);
Color.blanchedalmond = new Color(0xffebcd);
Color.blueviolet = new Color(0x8a2be2);
Color.brown = new Color(0xa52a2a);
Color.burlywood = new Color(0xdeb887);
Color.cadetblue = new Color(0x5f9ea0);
Color.chartreuse = new Color(0x7fff00);
Color.chocolate = new Color(0xd2691e);
Color.coral = new Color(0xff7f50);
Color.cornflowerblue = new Color(0x6495ed);
Color.cornsilk = new Color(0xfff8dc);
Color.crimson = new Color(0xdc143c);
Color.darkblue = new Color(0x00008b);
Color.darkcyan = new Color(0x008b8b);
Color.darkgoldenrod = new Color(0xb8860b);
Color.darkgray = new Color(0xa9a9a9);
Color.darkgreen = new Color(0x006400);
Color.darkgrey = new Color(0xa9a9a9);
Color.darkkhaki = new Color(0xbdb76b);
Color.darkmagenta = new Color(0x8b008b);
Color.darkolivegreen = new Color(0x556b2f);
Color.darkorange = new Color(0xff8c00);
Color.darkorchid = new Color(0x9932cc);
Color.darkred = new Color(0x8b0000);
Color.darksalmon = new Color(0xe9967a);
Color.darkseagreen = new Color(0x8fbc8f);
Color.darkslateblue = new Color(0x483d8b);
Color.darkslategray = new Color(0x2f4f4f);
Color.darkslategrey = new Color(0x2f4f4f);
Color.darkturquoise = new Color(0x00ced1);
Color.darkviolet = new Color(0x9400d3);
Color.deeppink = new Color(0xff1493);
Color.deepskyblue = new Color(0x00bfff);
Color.dimgray = new Color(0x696969);
Color.dimgrey = new Color(0x696969);
Color.dodgerblue = new Color(0x1e90ff);
Color.firebrick = new Color(0xb22222);
Color.floralwhite = new Color(0xfffaf0);
Color.forestgreen = new Color(0x228b22);
Color.gainsboro = new Color(0xdcdcdc);
Color.ghostwhite = new Color(0xf8f8ff);
Color.gold = new Color(0xffd700);
Color.goldenrod = new Color(0xdaa520);
Color.greenyellow = new Color(0xadff2f);
Color.grey = new Color(0x808080);
Color.honeydew = new Color(0xf0fff0);
Color.hotpink = new Color(0xff69b4);
Color.indianred = new Color(0xcd5c5c);
Color.indigo = new Color(0x4b0082);
Color.ivory = new Color(0xfffff0);
Color.khaki = new Color(0xf0e68c);
Color.lavender = new Color(0xe6e6fa);
Color.lavenderblush = new Color(0xfff0f5);
Color.lawngreen = new Color(0x7cfc00);
Color.lemonchiffon = new Color(0xfffacd);
Color.lightblue = new Color(0xadd8e6);
Color.lightcoral = new Color(0xf08080);
Color.lightcyan = new Color(0xe0ffff);
Color.lightgoldenrodyellow = new Color(0xfafad2);
Color.lightgray = new Color(0xd3d3d3);
Color.lightgreen = new Color(0x90ee90);
Color.lightgrey = new Color(0xd3d3d3);
Color.lightpink = new Color(0xffb6c1);
Color.lightsalmon = new Color(0xffa07a);
Color.lightseagreen = new Color(0x20b2aa);
Color.lightskyblue = new Color(0x87cefa);
Color.lightslategray = new Color(0x778899);
Color.lightslategrey = new Color(0x778899);
Color.lightsteelblue = new Color(0xb0c4de);
Color.lightyellow = new Color(0xffffe0);
Color.limegreen = new Color(0x32cd32);
Color.linen = new Color(0xfaf0e6);
Color.mediumaquamarine = new Color(0x66cdaa);
Color.mediumblue = new Color(0x0000cd);
Color.mediumorchid = new Color(0xba55d3);
Color.mediumpurple = new Color(0x9370db);
Color.mediumseagreen = new Color(0x3cb371);
Color.mediumslateblue = new Color(0x7b68ee);
Color.mediumspringgreen = new Color(0x00fa9a);
Color.mediumturquoise = new Color(0x48d1cc);
Color.mediumvioletred = new Color(0xc71585);
Color.midnightblue = new Color(0x191970);
Color.mintcream = new Color(0xf5fffa);
Color.mistyrose = new Color(0xffe4e1);
Color.moccasin = new Color(0xffe4b5);
Color.navajowhite = new Color(0xffdead);
Color.oldlace = new Color(0xfdf5e6);
Color.olivedrab = new Color(0x6b8e23);
Color.orangered = new Color(0xff4500);
Color.orchid = new Color(0xda70d6);
Color.palegoldenrod = new Color(0xeee8aa);
Color.palegreen = new Color(0x98fb98);
Color.paleturquoise = new Color(0xafeeee);
Color.palevioletred = new Color(0xdb7093);
Color.papayawhip = new Color(0xffefd5);
Color.peachpuff = new Color(0xffdab9);
Color.peru = new Color(0xcd853f);
Color.pink = new Color(0xffc0cb);
Color.plum = new Color(0xdda0dd);
Color.powderblue = new Color(0xb0e0e6);
Color.rosybrown = new Color(0xbc8f8f);
Color.royalblue = new Color(0x4169e1);
Color.saddlebrown = new Color(0x8b4513);
Color.salmon = new Color(0xfa8072);
Color.sandybrown = new Color(0xf4a460);
Color.seagreen = new Color(0x2e8b57);
Color.seashell = new Color(0xfff5ee);
Color.sienna = new Color(0xa0522d);
Color.skyblue = new Color(0x87ceeb);
Color.slateblue = new Color(0x6a5acd);
Color.slategray = new Color(0x708090);
Color.slategrey = new Color(0x708090);
Color.snow = new Color(0xfffafa);
Color.springgreen = new Color(0x00ff7f);
Color.steelblue = new Color(0x4682b4);
Color.tan = new Color(0xd2b48c);
Color.thistle = new Color(0xd8bfd8);
Color.tomato = new Color(0xff6347);
Color.turquoise = new Color(0x40e0d0);
Color.violet = new Color(0xee82ee);
Color.wheat = new Color(0xf5deb3);
Color.whitesmoke = new Color(0xf5f5f5);
Color.yellowgreen = new Color(0x9acd32);
Color.rebeccapurple = new Color(0xffa500);
class Rectangle {
    constructor(minOrLeft, maxOrTop, right, bottom) {
        if (typeof minOrLeft === "number" && typeof maxOrTop === "number") {
            this.min = new Vector2(minOrLeft, maxOrTop);
            this.max = new Vector2(right, bottom);
        }
        if (minOrLeft instanceof Vector2 && maxOrTop instanceof Vector2) {
            this.min = minOrLeft;
            this.max = maxOrTop;
        }
    }
    get left() {
        return this.min.x;
    }
    get top() {
        return this.min.y;
    }
    get right() {
        return this.max.x;
    }
    get bottom() {
        return this.max.y;
    }
    get width() {
        return this.max.x - this.min.x;
    }
    get height() {
        return this.max.y - this.min.y;
    }
    contains(value) {
        return (value.x >= this.min.x) && (value.y >= this.min.y) && (value.x < this.max.x) && (value.y < this.max.y);
    }
    clone() {
        return new Rectangle(this.min.clone(), this.max.clone());
    }
}
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(value) {
        return this.combine(value, (lhs, rhs) => lhs + rhs);
    }
    subtract(value) {
        return this.combine(value, (lhs, rhs) => lhs - rhs);
    }
    multiply(value) {
        return this.combine(value, (lhs, rhs) => lhs * rhs);
    }
    divide(value) {
        return this.combine(value, (lhs, rhs) => lhs / rhs);
    }
    combine(value, fn) {
        if (value instanceof Vector2) {
            return new Vector2(fn(this.x, value.x), fn(this.y, value.y));
        }
        else {
            return new Vector2(fn(this.x, value), fn(this.y, value));
        }
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    mutate() {
        return new Vector2Mutator(this);
    }
    static get zero() {
        return new Vector2(0, 0);
    }
    static get half() {
        return new Vector2(0.5, 0.5);
    }
    static get one() {
        return new Vector2(1, 1);
    }
}
class Vector2Mutator {
    constructor(origin) {
        this.origin = origin;
    }
    add(value) {
        this.apply(value, (lhs, rhs) => lhs + rhs);
        return this;
    }
    subtract(value) {
        this.apply(value, (lhs, rhs) => lhs - rhs);
        return this;
    }
    multiply(value) {
        this.apply(value, (lhs, rhs) => lhs * rhs);
        return this;
    }
    divide(value) {
        this.apply(value, (lhs, rhs) => lhs / rhs);
        return this;
    }
    apply(value, fn) {
        if (value instanceof Vector2) {
            this.origin.x = fn(this.origin.x, value.x);
            this.origin.y = fn(this.origin.y, value.y);
        }
        else {
            this.origin.x = fn(this.origin.x, value);
            this.origin.y = fn(this.origin.y, value);
        }
    }
}
class VectorGraphics {
    constructor(canvas) {
        this.canvas = canvas;
    }
    fillStyle(color) {
        this.canvas.fillStyle = color.toCssHex();
        return this;
    }
    strokeStyle(lineWidth, color) {
        this.canvas.lineWidth = lineWidth;
        if (color) {
            this.canvas.strokeStyle = color.toCssHex();
        }
        return this;
    }
    drawRect(x, y, width, height) {
        this.canvas.fillRect(x, y, width, height);
        this.canvas.strokeRect(x, y, width, height);
        return this;
    }
    drawRoundedRect(x, y, width, height, radius) {
        const canvas = this.canvas;
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(x, y + radius);
        canvas.lineTo(x, y + height - radius);
        canvas.quadraticCurveTo(x, y + height, x + radius, y + height);
        canvas.lineTo(x + width - radius, y + height);
        canvas.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        canvas.lineTo(x + width, y + radius);
        canvas.quadraticCurveTo(x + width, y, x + width - radius, y);
        canvas.lineTo(x + radius, y);
        canvas.quadraticCurveTo(x, y, x, y + radius);
        canvas.closePath();
        canvas.fill();
        canvas.stroke();
        canvas.restore();
        return this;
    }
}
//# sourceMappingURL=mechanism.js.map