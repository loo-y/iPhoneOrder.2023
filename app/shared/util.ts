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

interface IRandomSleepProps {
    min?: number
    max: number
    markText?: string
}
export const randomSleep = async ({ min, max, markText }: IRandomSleepProps) => {
    console.log(`sleep seconds =>`, `min: ${min}`, `max: ${max}`, markText || '')
    const sec = (min || 0) + Math.random() * max
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

type TValue = string | Record<string, any> | Array<any> | null | number | boolean

export const saveToStorage = async <T extends TValue>(tValue: T, storeName: string): Promise<void> => {
    let msg = ''
    // @ts-ignore
    if (typeof chrome === 'undefined' || !chrome.storage) {
        msg = 'Please use as chrome extension'
        return
    }
    console.log(`save to store`, tValue)
    const storedValue = (await restoreFromStorage()) as Record<string, any>
    const storeValue = { ...storedValue, [storeName]: tValue }
    // @ts-ignore
    chrome.storage.sync.set(storeValue)
}

export const restoreFromStorage = async <T extends TValue>(storeName?: string): Promise<T> => {
    let msg = ''
    // @ts-ignore
    if (typeof chrome === 'undefined' || !chrome.storage) {
        msg = 'Please use as chrome extension'
        console.log(`msg`, msg, typeof chrome)
        return null as T
    }

    return new Promise<T>((resolve, reject) => {
        // @ts-ignore
        chrome.storage?.sync.get(null, (items: any) => {
            if (!storeName) {
                resolve({ ...items })
            } else {
                const value = items?.[storeName]
                // incase value is false
                if (value === undefined) {
                    resolve({} as T)
                } else {
                    resolve(value)
                }
            }
        })
    }).catch(e => {
        console.error(e)
        return {} as T
    })
}
