interface History {
    onpushstate: Function
}

interface HTMLInputElement {
    _valueTracker: any
}

interface Event {
    simulated?: boolean
}

interface Chrome {
    [index: string]: any,
}

// 扩展全局对象类型定义
declare const chrome: Chrome;

