import crossfetch from 'cross-fetch'
import { applePageUrl, commonHeaders } from '../../shared/constants'

// fix TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation
const fetch = crossfetch.bind(this)

const getPageInitInfo = async () => {
    let partNumber, x_aos_stk
    const initData = document.getElementById('init_data')?.textContent
    const initDataJson: Record<string, any> = initData ? JSON.parse(initData) : {}
    const { meta, checkout } = initDataJson || {}
    x_aos_stk = meta?.h?.['x-aos-stk']

    const checkoutPickUpItems = checkout?.fulfillment?.pickupTab?.pickup?.items || {}
    // console.log(`checkoutPickUpItems`, checkoutPickUpItems)
    const firstC = checkoutPickUpItems?.c?.[0] || ''
    if (firstC) {
        const firstItemInfo = checkoutPickUpItems[firstC] || {}
        const baseInfo = firstItemInfo.d || {}
        const productEvar1 = baseInfo?.productEvar1?.split('|')
        partNumber = productEvar1?.length && productEvar1[productEvar1.length - 1]
    }

    if (!partNumber) {
        let shopBagResText = ''
        try {
            let headers: any = { ...commonHeaders }
            delete headers.referer
            const shopBagRes = await fetch(applePageUrl.shoppingCartWithoutHost, {
                headers: headers,
                credentials: 'include',
            })
            shopBagResText = await shopBagRes.text()
        } catch (e) {
            console.log(`fetch error`, e)
        }

        partNumber = shopBagResText?.match(/(?<=productEvar1\"\:"Cart\|\|)([a-zA-Z0-9]+\/A)/g)?.[0]
    }

    // console.log(`partNumber`, partNumber)
    return {
        partNumber,
        x_aos_stk,
    }
}

export default getPageInitInfo
