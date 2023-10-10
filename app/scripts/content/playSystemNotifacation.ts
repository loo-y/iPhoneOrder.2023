import { VOICE_OBJ } from '../../shared/interface'

const defaultVoiceInfo = {
    text: `抢到了`,
    times: 1,
}

const playSystemNotification = async ({ voiceInfo }: { voiceInfo: VOICE_OBJ }) => {
    let extensionId
    if (typeof chrome !== 'undefined' && chrome?.runtime) {
        extensionId = chrome.runtime.id
        chrome.runtime.sendMessage({ data: 'bellring', extensionId, voiceInfo })
    }

    // 检查浏览器是否支持 Web Notifications API
    if ('Notification' in window) {
        const icon = extensionId ? `chrome-extension://${extensionId}/icons/icon38.png` : undefined
        // 请求权限显示通知
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // 创建通知对象
                const notification = new Notification('提醒', {
                    body: voiceInfo?.text || defaultVoiceInfo.text,
                    icon,
                })

                // 将通知点击时的行为处理逻辑添加在这里
                notification.onclick = function () {
                    // 处理通知点击事件
                    console.log('通知被点击了')
                }
            }
        })
    } else {
        console.log(`notification fail`)
    }
}

export default playSystemNotification
