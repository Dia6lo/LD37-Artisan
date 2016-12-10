declare class Application {
    view: HTMLDivElement;
    renderer: Renderer;
    root: RenderObject;
    audio: AudioPlayer;
    input: Input;
    fps: number;
    private time;
    constructor(width?: number, height?: number);
    run(): void;
    private onKeyDown(event);
    private onKeyUp(event);
    private handleAnimationFrame(time);
    render(): void;
    update(delta: number): void;
    translateKey(code: string): Key.Unknown | Key.Up | Key.Down | Key.Left | Key.Right | Key.Space;
}
declare class AudioPlayer {
    view: HTMLDivElement;
    private audioElements;
    private freeAudioElements;
    constructor();
    play(source: string, loop?: boolean): void;
}
declare class EventObserver<T extends Function> {
    fn: T;
    context: any;
    once: boolean;
    needsRemoval: boolean;
    constructor(fn: T, context: any, once: boolean);
    execute(dispatcher: (fn: T) => void): void;
}
interface ObservableEvent<T extends Function> {
    subscribe(fn: T, context?: any): void;
    subscribeOnce(fn: T, context?: any): void;
    remove(fn: T): void;
    removeAll(): void;
}
declare class ObservableEventHost<T extends Function> implements ObservableEvent<T> {
    private observers;
    dispatch(dispatcher: (fn: T) => void): void;
    subscribe(fn: T, context?: any): void;
    subscribeOnce(fn: T, context?: any): void;
    private addObserver(fn, context, once);
    remove(fn: T): void;
    removeAll(): void;
    static create<T extends Function>(): ObservableEventHost<T>;
}
interface Array<T> {
    last(filter?: (element: T, index: number) => boolean): T;
    lastOrDefault(filter?: (element: T, index: number) => boolean): T;
    first(filter?: (element: T, index: number) => boolean): T;
    firstOrDefault(filter?: (element: T, index: number) => boolean): T;
    any(): boolean;
}
interface Math {
    lerp(amount: number, from: number, to: number): number;
    clamp(value: number, min: number, max: number): number;
    HALFPI: number;
}
declare class Input {
    private previousKeyState;
    private currentKeyState;
    private keyEventQueue;
    isKeyPressed(key: Key): boolean;
    wasKeyPressed(key: Key): boolean;
    wasKeyReleased(key: Key): boolean;
    addKeyEvent(key: Key, down: boolean): void;
    processPendingKeyEvents(): void;
}
declare const enum Key {
    Unknown = 0,
    LShift = 1,
    ShiftLeft = 1,
    RShift = 2,
    ShiftRight = 2,
    LControl = 3,
    ControlLeft = 3,
    RControl = 4,
    ControlRight = 4,
    AltLeft = 5,
    LAlt = 5,
    AltRight = 6,
    RAlt = 6,
    WinLeft = 7,
    LWin = 7,
    RWin = 8,
    WinRight = 8,
    Menu = 9,
    F1 = 10,
    F2 = 11,
    F3 = 12,
    F4 = 13,
    F5 = 14,
    F6 = 15,
    F7 = 16,
    F8 = 17,
    F9 = 18,
    F10 = 19,
    F11 = 20,
    F12 = 21,
    F13 = 22,
    F14 = 23,
    F15 = 24,
    F16 = 25,
    F17 = 26,
    F18 = 27,
    F19 = 28,
    F20 = 29,
    F21 = 30,
    F22 = 31,
    F23 = 32,
    F24 = 33,
    F25 = 34,
    F26 = 35,
    F27 = 36,
    F28 = 37,
    F29 = 38,
    F30 = 39,
    F31 = 40,
    F32 = 41,
    F33 = 42,
    F34 = 43,
    F35 = 44,
    Up = 45,
    Down = 46,
    Left = 47,
    Right = 48,
    Enter = 49,
    Escape = 50,
    Space = 51,
    Tab = 52,
    Back = 53,
    BackSpace = 53,
    Insert = 54,
    Delete = 55,
    PageUp = 56,
    PageDown = 57,
    Home = 58,
    End = 59,
    CapsLock = 60,
    ScrollLock = 61,
    PrintScreen = 62,
    Pause = 63,
    NumLock = 64,
    Clear = 65,
    Sleep = 66,
    Keypad0 = 67,
    Keypad1 = 68,
    Keypad2 = 69,
    Keypad3 = 70,
    Keypad4 = 71,
    Keypad5 = 72,
    Keypad6 = 73,
    Keypad7 = 74,
    Keypad8 = 75,
    Keypad9 = 76,
    KeypadDivide = 77,
    KeypadMultiply = 78,
    KeypadMinus = 79,
    KeypadSubtract = 79,
    KeypadAdd = 80,
    KeypadPlus = 80,
    KeypadDecimal = 81,
    KeypadEnter = 82,
    A = 83,
    B = 84,
    C = 85,
    D = 86,
    E = 87,
    F = 88,
    G = 89,
    H = 90,
    I = 91,
    J = 92,
    K = 93,
    L = 94,
    M = 95,
    N = 96,
    O = 97,
    P = 98,
    Q = 99,
    R = 100,
    S = 101,
    T = 102,
    U = 103,
    V = 104,
    W = 105,
    X = 106,
    Y = 107,
    Z = 108,
    Number0 = 109,
    Number1 = 110,
    Number2 = 111,
    Number3 = 112,
    Number4 = 113,
    Number5 = 114,
    Number6 = 115,
    Number7 = 116,
    Number8 = 117,
    Number9 = 118,
    Tilde = 119,
    Minus = 120,
    Plus = 121,
    LBracket = 122,
    BracketLeft = 122,
    BracketRight = 123,
    RBracket = 123,
    Semicolon = 124,
    Quote = 125,
    Comma = 126,
    Period = 127,
    Slash = 128,
    BackSlash = 129,
}
declare class Mechanism {
    static version: string;
    static helloWorld(): void;
}
declare class Renderer {
    view: HTMLCanvasElement;
    backgroundColor: Color;
    vectorGraphics: VectorGraphics;
    readonly context: CanvasRenderingContext2D;
    constructor(width: number, height: number);
    width: number;
    height: number;
    size: Vector2;
    imageSmoothing: boolean;
    globalAlpha: number;
    render(renderObject: RenderObject): void;
    renderTexture(texture?: Texture, x?: number, y?: number, width?: number, height?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number): void;
    renderText(text: string, x?: number, y?: number): void;
    measureText(text: string): number;
    private renderUndefinedTexture(x?, y?, width?, height?);
    translate(x: number, y: number): void;
    rotate(angle: number): void;
    scale(x: number, y: number): void;
    save(): void;
    restore(): void;
    clip(x: number, y: number, width: number, height: number): void;
    flush(): void;
}
declare class Animation {
    frameCount: number;
    private animators;
    private currentFrame;
    finalAction: FinalAnimationAction;
    isRunning: boolean;
    private animationEndedHost;
    readonly animationEnded: ObservableEvent<() => void>;
    constructor(frameCount: number);
    run(frame?: number): void;
    setAnimator(animator: Animator): void;
    advance(frameCount: number, object: RenderObject): FinalAnimationAction | undefined;
    static loop(frame?: number): FinalAnimationAction;
    static goto(frame: number, animation: string): FinalAnimationAction;
}
declare class AnimationCollection {
    private animations;
    set(name: string, animation: Animation): void;
    get(name: string): Animation;
    tryGet(name: string): Animation;
}
declare abstract class Animator {
    readonly name: string;
    frames: KeyFrame<any>[];
    protected constructor(name: string);
    apply(object: RenderObject, frame: number): void;
    protected abstract applyValue(object: RenderObject, value: any): void;
    protected abstract interpolate(amount: number, from: any, to: any, interpolation: Interpolation): any;
}
declare class GenericAnimator<TObject extends RenderObject, TValue> extends Animator {
    frames: KeyFrame<TValue>[];
    constructor(name: string);
    setFrame(frame: number, value: TValue, interpolation?: Interpolation): void;
    applyValue(object: TObject, value: any): void;
    interpolate(amount: number, from: any, to: any, interpolation: Interpolation): any;
}
declare class Vector2Animator<T extends RenderObject> extends GenericAnimator<T, Vector2> {
    interpolate(amount: number, from: Vector2, to: Vector2, interpolation: Interpolation): Vector2;
}
declare class NumberAnimator<T extends RenderObject> extends GenericAnimator<T, number> {
    interpolate(amount: number, from: number, to: number, interpolation: Interpolation): number;
}
declare class FinalAnimationAction {
    frame: number;
    animation: string;
    constructor(frame: number, animation?: string);
}
declare enum Interpolation {
    None = 0,
    Linear = 1,
}
declare class KeyFrame<T> {
    value: T;
    interpolation: Interpolation;
    constructor(value: T, interpolation?: Interpolation);
}
declare class RenderObject {
    children: RenderObject[];
    parent?: RenderObject;
    animations: AnimationCollection;
    tasks: TaskList;
    currentAnimation: Animation;
    addChild(container: RenderObject): void;
    removeChild(container: RenderObject): boolean;
    removeFromParent(): void;
    render(renderer: Renderer): void;
    beforeRender(renderer: Renderer): void;
    afterRender(renderer: Renderer): void;
    update(delta: number): void;
    runAnimation(name: string, frame?: number): void;
    tryRunAnimation(name: string, frame?: number): void;
    runChildAnimation(name: string): void;
}
declare class Widget extends RenderObject {
    children: Widget[];
    position: Vector2;
    scale: Vector2;
    rotation: number;
    pivot: Vector2;
    size: Vector2;
    opacity: number;
    beforeRender(renderer: Renderer): void;
    afterRender(renderer: Renderer): void;
    x: number;
    y: number;
    width: number;
    height: number;
    addChild(widget: Widget): void;
    static positionAnimator: () => Vector2Animator<RenderObject>;
    static scaleAnimator: () => Vector2Animator<RenderObject>;
    static pivotAnimator: () => Vector2Animator<RenderObject>;
    static sizeAnimator: () => Vector2Animator<RenderObject>;
    static rotationAnimator: () => NumberAnimator<RenderObject>;
}
declare class Label extends Widget {
    text: string;
    verticalTextAlignment: TextAlignment;
    horizontalTextAlignment: TextAlignment;
    constructor(text?: string);
    render(renderer: Renderer): void;
}
declare class NineGrid extends Widget {
    texture: Texture;
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(texture?: Texture);
    render(renderer: Renderer): void;
    private getParts();
}
declare class Sprite extends Widget {
    texture: Texture;
    constructor(texture?: Texture);
    static fromImage(url: string): Sprite;
    render(renderer: Renderer): void;
    static textureAnimator: () => GenericAnimator<Sprite, Texture>;
}
declare class Task {
    private readonly iterator;
    static current?: Task;
    private waitPredicate?;
    completed: boolean;
    totalTime: number;
    delta: number;
    constructor(iterator: Iterator<WaitPredicate>);
    update(delta: number): void;
    private processWaitPredicate(delta);
    static sinMotion(timePeriod: number, from: number, to: number): IterableIterator<number>;
    static sqrtMotion(timePeriod: number, from: number, to: number): IterableIterator<number>;
    static linearMotion(timePeriod: number, from: number, to: number): IterableIterator<number>;
    static motion(timePeriod: number, from: number, to: number, fn: (fraction: number) => number): IterableIterator<number>;
}
declare class TaskList {
    static current?: TaskList;
    private tasks;
    add(task: Task | Iterator<WaitPredicate>): void;
    update(delta: number): void;
}
declare class Wait {
    static seconds(seconds: number): TimeWaitPredicate;
    static frame(): FrameWaitPredicate;
    static task(task: Iterator<WaitPredicate>): TaskWaitPredicate;
    static while(predicate: (totalTime: number) => boolean): BooleanWaitPredicate;
    static animation(renderObject: RenderObject): AnimationWaitPredicate;
}
declare abstract class WaitPredicate {
    totalTime: number;
    abstract evaluate(): boolean;
}
declare class AnimationWaitPredicate extends WaitPredicate {
    renderObject: RenderObject;
    evaluate(): boolean;
}
declare class BooleanWaitPredicate extends WaitPredicate {
    predicate: (totalTime: number) => boolean;
    evaluate(): boolean;
}
declare class TimeWaitPredicate extends WaitPredicate {
    waitTime: number;
    evaluate(): boolean;
}
declare class TaskWaitPredicate extends WaitPredicate {
    task: Task;
    evaluate(): boolean;
}
declare class FrameWaitPredicate extends WaitPredicate {
    evaluate(): boolean;
}
declare enum TextAlignment {
    Start = 0,
    Center = 1,
    End = 2,
}
declare class Texture {
    source?: HTMLImageElement;
    constructor(source?: HTMLImageElement);
    static fromImage(url: string): Texture;
    readonly size: Vector2;
    readonly width: number;
    readonly height: number;
}
declare class Color {
    private readonly hex;
    constructor(color: number | string);
    readonly r: number;
    readonly g: number;
    readonly b: number;
    toHex(): string;
    toInt(): number;
    toCssHex(): string;
    static fromComponents(r: number, g: number, b: number): Color;
    static black: Color;
    static silver: Color;
    static gray: Color;
    static white: Color;
    static maroon: Color;
    static red: Color;
    static purple: Color;
    static fuchsia: Color;
    static green: Color;
    static lime: Color;
    static olive: Color;
    static yellow: Color;
    static navy: Color;
    static blue: Color;
    static teal: Color;
    static aqua: Color;
    static orange: Color;
    static aliceblue: Color;
    static antiquewhite: Color;
    static aquamarine: Color;
    static azure: Color;
    static beige: Color;
    static bisque: Color;
    static blanchedalmond: Color;
    static blueviolet: Color;
    static brown: Color;
    static burlywood: Color;
    static cadetblue: Color;
    static chartreuse: Color;
    static chocolate: Color;
    static coral: Color;
    static cornflowerblue: Color;
    static cornsilk: Color;
    static crimson: Color;
    static darkblue: Color;
    static darkcyan: Color;
    static darkgoldenrod: Color;
    static darkgray: Color;
    static darkgreen: Color;
    static darkgrey: Color;
    static darkkhaki: Color;
    static darkmagenta: Color;
    static darkolivegreen: Color;
    static darkorange: Color;
    static darkorchid: Color;
    static darkred: Color;
    static darksalmon: Color;
    static darkseagreen: Color;
    static darkslateblue: Color;
    static darkslategray: Color;
    static darkslategrey: Color;
    static darkturquoise: Color;
    static darkviolet: Color;
    static deeppink: Color;
    static deepskyblue: Color;
    static dimgray: Color;
    static dimgrey: Color;
    static dodgerblue: Color;
    static firebrick: Color;
    static floralwhite: Color;
    static forestgreen: Color;
    static gainsboro: Color;
    static ghostwhite: Color;
    static gold: Color;
    static goldenrod: Color;
    static greenyellow: Color;
    static grey: Color;
    static honeydew: Color;
    static hotpink: Color;
    static indianred: Color;
    static indigo: Color;
    static ivory: Color;
    static khaki: Color;
    static lavender: Color;
    static lavenderblush: Color;
    static lawngreen: Color;
    static lemonchiffon: Color;
    static lightblue: Color;
    static lightcoral: Color;
    static lightcyan: Color;
    static lightgoldenrodyellow: Color;
    static lightgray: Color;
    static lightgreen: Color;
    static lightgrey: Color;
    static lightpink: Color;
    static lightsalmon: Color;
    static lightseagreen: Color;
    static lightskyblue: Color;
    static lightslategray: Color;
    static lightslategrey: Color;
    static lightsteelblue: Color;
    static lightyellow: Color;
    static limegreen: Color;
    static linen: Color;
    static mediumaquamarine: Color;
    static mediumblue: Color;
    static mediumorchid: Color;
    static mediumpurple: Color;
    static mediumseagreen: Color;
    static mediumslateblue: Color;
    static mediumspringgreen: Color;
    static mediumturquoise: Color;
    static mediumvioletred: Color;
    static midnightblue: Color;
    static mintcream: Color;
    static mistyrose: Color;
    static moccasin: Color;
    static navajowhite: Color;
    static oldlace: Color;
    static olivedrab: Color;
    static orangered: Color;
    static orchid: Color;
    static palegoldenrod: Color;
    static palegreen: Color;
    static paleturquoise: Color;
    static palevioletred: Color;
    static papayawhip: Color;
    static peachpuff: Color;
    static peru: Color;
    static pink: Color;
    static plum: Color;
    static powderblue: Color;
    static rosybrown: Color;
    static royalblue: Color;
    static saddlebrown: Color;
    static salmon: Color;
    static sandybrown: Color;
    static seagreen: Color;
    static seashell: Color;
    static sienna: Color;
    static skyblue: Color;
    static slateblue: Color;
    static slategray: Color;
    static slategrey: Color;
    static snow: Color;
    static springgreen: Color;
    static steelblue: Color;
    static tan: Color;
    static thistle: Color;
    static tomato: Color;
    static turquoise: Color;
    static violet: Color;
    static wheat: Color;
    static whitesmoke: Color;
    static yellowgreen: Color;
    static rebeccapurple: Color;
}
declare class Rectangle {
    min: Vector2;
    max: Vector2;
    constructor(min: Vector2, max: Vector2);
    constructor(left: number, top: number, right: number, bottom: number);
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly width: number;
    readonly height: number;
    contains(value: Vector2): boolean;
}
declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): void;
    readonly length: number;
    add(value: Vector2 | number): Vector2;
    subtract(value: Vector2 | number): Vector2;
    multiply(value: Vector2 | number): Vector2;
    divide(value: Vector2 | number): Vector2;
    private combine(value, fn);
    clone(): Vector2;
    mutate(): Vector2Mutator;
    static readonly zero: Vector2;
    static readonly half: Vector2;
    static readonly one: Vector2;
}
declare class Vector2Mutator {
    private readonly origin;
    constructor(origin: Vector2);
    add(value: Vector2 | number): Vector2Mutator;
    subtract(value: Vector2): Vector2Mutator;
    multiply(value: Vector2 | number): Vector2Mutator;
    divide(value: Vector2 | number): Vector2Mutator;
    private apply(value, fn);
}
declare class VectorGraphics {
    private readonly canvas;
    constructor(canvas: CanvasRenderingContext2D);
    fillStyle(color: Color): VectorGraphics;
    strokeStyle(lineWidth: number, color?: Color): VectorGraphics;
    drawRect(x: number, y: number, width: number, height: number): VectorGraphics;
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): VectorGraphics;
}
