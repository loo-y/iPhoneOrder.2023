import { iPhoneModels } from '@/app/shared/constants'
import doFroApplePages from './doFroApplePages'
import { restoreFromStorage } from '@/app/shared/util'
import { storeKeys } from '@/app/shared/constants'

console.log(`this is content`)
const contentRun = async () => {
    const orderEnabled = !!(await restoreFromStorage(storeKeys.orderEnabled))
    console.log(`orderEnabled`, orderEnabled)
    if (!orderEnabled) return
    // // 重写pushStae方法，用来监听
    // let pushState = history.pushState
    // history.pushState = async function (...args) {
    //     const state = args[0]
    //     if (typeof window.history.onpushstate == 'function') {
    //         window.history.onpushstate({ state: state })
    //     }

    //     console.log(`arguments`, args)
    //     let url: string = (args[2] as string) || ''
    //     url = url && url.search(/^http/) > -1 ? url : ''

    //     let pushResult = pushState.apply(window.history, args)
    //     console.log(`history`, window.history.length, location.href)

    //     await doFroApplePages(url)
    //     return pushResult
    // }

    await doFroApplePages()
}

contentRun()

window.addEventListener('message', function (event) {
    if (event.source === window && event.data.action === 'doFroApplePages') {
        // 在这里执行你的方法逻辑
        doFroApplePages(event.data.url)
    }
})

// 监听页面的加载完成事件
window.addEventListener('load', injectCustomScript)

// 注入自定义脚本到页面中
function injectCustomScript() {
    var script = document.createElement('script')
    var extensionId = chrome.runtime.id
    console.log(extensionId)
    script.src = `chrome-extension://${extensionId}/inject-script.js`
    // script.textContent = `
    //   // 重写 history.pushState 方法
    //   (function(history) {
    //     var originalPushState = history.pushState;

    //     history.pushState = function(state, title, url) {
    //         if (typeof history.onpushstate == 'function') {
    //             history.onpushstate({ state: state })
    //         }

    //         url = url && url.search(/^http/) > -1 ? url : ''

    //         window.postMessage({ action: 'doFroApplePages', url: url }, '*');
    //         // 调用原生的 history.pushState 方法
    //         return originalPushState.apply(history, arguments);
    //     };
    //     console.log(history.pushState)
    //   })(history);
    // `;
    document.documentElement.appendChild(script)
}
