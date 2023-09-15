import { IPHONEORDER_CONFIG } from '@/app/shared/interface'
import { applePageUrl, iPhoneModels, commonHeaders, defaultAres } from '@/app/shared/constants'
import { sleep } from '@/app/shared/util'
import crossfetch from 'cross-fetch'
import { each as _each, map as _map } from 'lodash'

const fetch = crossfetch.bind(this)

/*
 *   @partNumber iPhone 型号
 *   @isNoWait 是否等待，不等待表示纯粹调用接口
 */
interface IGetStoreCanPickInfoProps {
    partNumber: string
    isNoWait?: boolean
    iPhoneOrderConfig: IPHONEORDER_CONFIG
}
const getStoreCanPickInfo = async ({ partNumber, isNoWait, iPhoneOrderConfig }: IGetStoreCanPickInfoProps) => {
    let pickupStoreInfo: Record<string, any> = {}
    const { host, protocol } = window.location || {}
    let url = `${protocol}//www.apple.com.cn/shop/fulfillment-messages`

    const districtName = iPhoneOrderConfig.districtName || defaultAres.districtName
    const provinceName = iPhoneOrderConfig.provinceName || defaultAres.provinceName
    const cityName = iPhoneOrderConfig.cityName || defaultAres.cityName
    let reqQuery = {
        'parts.0': partNumber, // 型号 `MQ8G3CH/A`,
        'mts.0': `regular`,
        pl: true,
        location: `${provinceName} ${cityName} ${districtName}`,
        geoLocated: false,
        state: provinceName,
        city: cityName,
        district: districtName,
    }

    const querystring = _map(reqQuery, (value, key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    }).join(`&`)

    url = `${url}?${querystring}`

    let options = {
        method: 'GET',
        headers: {
            ...commonHeaders,
            referer: applePageUrl.buyiPhone,
        },
    }

    try {
        let resJson = (await fetch(url, options)) as Record<string, any>

        const { pickupMessage } = resJson?.body?.content || {}
        // 如果请求失败， 表示被封禁
        if (![200, 301, 302].includes(Number(resJson?.head?.status))) {
            if (!isNoWait) {
                console.log(`********** GMfetch failed, stepWait add 1 sec **********`)
                console.log(`resJson`, resJson)
                iPhoneOrderConfig.stepWait = iPhoneOrderConfig.stepWait + 1
                if (String(resJson)?.indexOf(`503 Service Temporarily Unavailable`) > -1) {
                    console.log(`********** and wait 1 min **********`)
                    // 换一个型号调用，让apple认为是正常请求
                    const iPhoneProAll = iPhoneModels.iPhone15Pro
                    const randomPartNumberiPhonePro =
                        iPhoneProAll[Math.floor(Math.random() * iPhoneProAll.length)]?.model
                    await getStoreCanPickInfo({
                        partNumber: randomPartNumberiPhonePro,
                        isNoWait: true,
                        iPhoneOrderConfig,
                    })
                    await sleep(60)
                }
            } else {
                console.log(`********** GMfetch failed, NoWait failed **********`)
            }
        }

        let partPickupStores = pickupMessage?.stores || [],
            pickupNumbers = ''
        _each(partPickupStores, store => {
            const { partsAvailability, pickupEncodedUpperDateString, storeName, city, storeNumber } = store || {}
            // 有时候会搜出周边城市，这里用于排除周边城市
            const isInCity = city == cityName
            const partAvailability = partsAvailability?.[partNumber] || {}
            if (
                isInCity &&
                partAvailability?.pickupDisplay?.toString()?.toLowerCase() == `available` &&
                pickupEncodedUpperDateString
            ) {
                pickupNumbers = pickupEncodedUpperDateString.match(/(\d{4})(\d{2})(\d{2})/)
                if (pickupNumbers) {
                    console.log(`${storeName}: ${pickupNumbers?.[0]}, ${storeNumber}`)
                    pickupStoreInfo = {
                        ...pickupStoreInfo,
                        storeNumber,
                        storeName,
                    }
                    return false
                }
            }
        })
    } catch (e) {
        console.log(e)
        if (!isNoWait) {
            console.log(`********** GMfetch failed, stepWait add 1 sec, and wait 1 min **********`)
            iPhoneOrderConfig.stepWait = iPhoneOrderConfig.stepWait + 1
            // 换一个型号调用，让apple认为是正常请求
            const iPhoneProAll = iPhoneModels.iPhone15Pro
            const randomPartNumberiPhonePro = iPhoneProAll[Math.floor(Math.random() * iPhoneProAll.length)]?.model
            await getStoreCanPickInfo({ partNumber: randomPartNumberiPhonePro, isNoWait: true, iPhoneOrderConfig })
            await sleep(10)
        } else {
            console.log(`********** GMfetch failed, NoWait failed **********`)
        }
    }

    console.log(`pickupStoreInfo`, pickupStoreInfo)
    return pickupStoreInfo
}

export default getStoreCanPickInfo
