export const sleep = async (sec: number | string, markText?: string) => {
    console.log(`sleep seconds:`, sec, markText || '')
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

export const getElemByID = (idname: string) => {
    if (!idname) return null
    return document.getElementById(idname) || document.querySelector(`#${idname}`) || null
}

interface ArrayOrObject extends Record<string, any> {}
interface ArrayOrObject extends Array<any> {}

export const saveToStorage = <T extends ArrayOrObject>(arrayOrObject: T, storeName: string): void => {
    let msg = ''
    // @ts-ignore
    if (typeof chrome === 'undefined' || !chrome?.tabs) {
        msg = 'Please use as chrome extension'
        return
    }
    console.log(`save to store`, arrayOrObject)
    const storedValue = restoreFromStorage()
    const storeValue = { ...storedValue, [storeName]: arrayOrObject }
    // @ts-ignore
    chrome.storage.sync.set(storeValue)
}

export const restoreFromStorage = async <T extends ArrayOrObject>(storeName?: string): Promise<T> => {
    let msg = ''
    // @ts-ignore
    if (typeof chrome === 'undefined' || !chrome?.tabs) {
        msg = 'Please use as chrome extension'
        return {} as T
    }

    return new Promise<T>((resolve, reject) => {
        // @ts-ignore
        chrome.storage.sync.get(null, (items: any) => {
            if (!storeName) {
                resolve({ ...items })
            } else {
                const value = items?.[storeName] || {}
                resolve(value)
            }
        })
    }).catch(e => {
        console.error(e)
        return {} as T
    })
}
