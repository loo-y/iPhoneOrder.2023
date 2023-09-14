console.log(`this is content`)
import { iPhoneModels } from '@/app/shared/constants'
import doFroApplePages from './doFroApplePages'
import getPageInitInfo from './getPageInitInfo'
import { restoreFromStorage } from '@/app/shared/util'
import { storeKeys } from '@/app/shared/constants'

const contentRun = async () => {
    const orderEnabled = !!(await restoreFromStorage(storeKeys.orderEnabled))
    console.log(`orderEnabled`, orderEnabled)
    if (!orderEnabled) return
    const pageInfo = await getPageInitInfo()
    console.log(`getPageInitInfo, `, pageInfo)
    await doFroApplePages()
    // 重写pushStae方法，用来监听
    let pushState = history.pushState
    history.pushState = async function (...args) {
        const state = args[0]
        if (typeof history.onpushstate == 'function') {
            history.onpushstate({ state: state })
        }

        console.log(`arguments`, args)
        let url: string = (args[2] as string) || ''
        url = url && url.search(/^http/) > -1 ? url : ''

        let pushResult = pushState.apply(history, args)
        console.log(`history`, history.length, location.href)

        await doFroApplePages(url)
        return pushResult
    }
}

contentRun()
