export const sleep = async (sec: number | string) => {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                resolve(true)
            },
            Number(sec) * 1000
        )
    })
}

export const changeInputValue = (inputDom?: HTMLInputElement, newText?: any) => {
    if (!inputDom) return
    let lastvalue = inputDom.value
    inputDom.value = newText
    let event = new Event('input', { bubbles: true })
    event.simulated = true
    let tracker = inputDom._valueTracker
    if (tracker) {
        tracker.setValue(lastvalue)
    }
    inputDom.dispatchEvent(event)
}
