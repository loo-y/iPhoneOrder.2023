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

export const sleep = async (sec: number | string, markText?: string) => {
    console.log(`sleep seconds:`, sec, markText || '')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, Number(sec) * 1000)
    })
}

export const GMfetch = async ({
    url,
    options,
    data,
    isText,
}: {
    url: string
    options: AnyObj
    data?: AnyObj
    isText?: boolean
}) => {
    console.log(`GMfetch url`, url, options)
    return new Promise<string | object>((resolve, reject) => {
        let fetchParamsWithOptionsAndData: AnyObj = {
            ...options,
            url,
        }
        if (data) {
            fetchParamsWithOptionsAndData.data = data
        }

        // Tampermonkey API
        GM_xmlhttpRequest({
            ...fetchParamsWithOptionsAndData,
            onload: (response: GMXMLResponse) => {
                if (isText) {
                    resolve(response.responseText)
                } else {
                    try {
                        resolve(JSON.parse(response.responseText))
                    } catch (e) {
                        resolve(response.responseText)
                    }
                }
            },
            onerror: (response: GMXMLResponse) => {
                reject(`GMfetch error`)
            },
        })
    })
}
