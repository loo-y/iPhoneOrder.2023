import doFroApplePages from './doFroApplePages'
import { iframeMessagePass } from '../../shared/constants'
import playSystemNotification from './playSystemNotifacation'

// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { data, voiceInfo } = message || {}
    const { text } = voiceInfo || {}
    if (data == 'playSystemNotification' && text) {
        playSystemNotification({ voiceInfo: voiceInfo })
    }
})

const addTipsToPage = () => {
    var extensionId = chrome.runtime.id
    const iframe = document.createElement('iframe')
    iframe.id = iframeMessagePass.iframeID
    iframe.style.cssText = `
        right: 0;
        top: 50%;
        width: 250px;
        height: 160px;
    `
    iframe.src = `chrome-extension://${extensionId}/dist/tips.html`
    document.documentElement.appendChild(iframe)
    iframe.style.position = 'fixed'
    console.log(`addTipsToPage`)
}

console.log(`this is content`)
const contentRun = async () => {
    addTipsToPage()

    // const orderEnabled = !!(await restoreFromStorage(storeKeys.orderEnabled))
    // console.log(`orderEnabled`, orderEnabled)
    // if (!orderEnabled) return
    await doFroApplePages()
}

contentRun()

window.addEventListener('message', function (event) {
    if (event.source === window && event.data.action === 'doFroApplePages') {
        // 在这里执行你的方法逻辑
        doFroApplePages(event.data.url)
    }
})

// 监听页面的加载完成事件, 注入自定义脚本到页面中
window.addEventListener('load', function injectCustomScript() {
    var script = document.createElement('script')
    var extensionId = chrome.runtime.id
    console.log(extensionId)
    script.src = `chrome-extension://${extensionId}/inject-script.js`
    document.documentElement.appendChild(script)
})
