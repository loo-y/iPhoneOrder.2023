import { iPhoneModels } from '@/app/shared/constants'
import doFroApplePages from './doFroApplePages'
import { restoreFromStorage } from '@/app/shared/util'
import { storeKeys } from '@/app/shared/constants'

console.log(`this is content`)
const contentRun = async () => {
    const orderEnabled = !!(await restoreFromStorage(storeKeys.orderEnabled))
    console.log(`orderEnabled`, orderEnabled)
    if (!orderEnabled) return
    // 重写pushStae方法，用来监听
    let pushState = window.history.pushState
    window.history.pushState = async function (...args) {
        const state = args[0]
        if (typeof window.history.onpushstate == 'function') {
            window.history.onpushstate({ state: state })
        }

        console.log(`arguments`, args)
        let url: string = (args[2] as string) || ''
        url = url && url.search(/^http/) > -1 ? url : ''

        let pushResult = pushState.apply(window.history, args)
        console.log(`history`, window.history.length, location.href)

        await doFroApplePages(url)
        return pushResult
    }

    await doFroApplePages()
}

contentRun()

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     // 处理接收到的消息
//     console.log('Received message from background page:', request);
//     if (request.message === 'contentRun') {
//         contentRun()
//     }
//     // 发送响应（可选）
//     sendResponse({ message: 'Response from content script' });
// });
