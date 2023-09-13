console.log(`this is content`)
import {iPhoneModels} from '@/app/shared/constants'

history.pushState = async function (...args) {
    const state = args[0]
    // @ts-ignore
    if (typeof history.onpushstate == 'function') {
        // @ts-ignore
        history.onpushstate({ state: state })
    }

    console.log(`arguments`, args)
    let url: string = (args[2] as string) || ''
    url = url && url.search(/^http/) > -1 ? url : ''
    // @ts-ignore
    let pushResult = pushState.apply(history, args, iPhoneModels)
    
    console.log(`history`, history.length, location.href)
    return pushResult
}