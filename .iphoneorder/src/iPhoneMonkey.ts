import _ from 'lodash'
import { sleep, changeInputValue, GMfetch } from './utils'
import {
    applePageUrl,
    pageElementsId,
    BILL_OPTIONS_TYPE,
    CHECKOUT_STEPS,
    afterCountThenReload,
    defaultAres,
    commonHeaders,
    fetchHeaders,
    iPhone_PartNumber_Types,
} from './constants'

const payBillType = _.mapValues(BILL_OPTIONS_TYPE, (v, k) => {
    return k
})
let iPhoneOrderConfig: IPHONEORDERCONFIG = {
    lastName: undefined,
    firstName: undefined,
    mobile: undefined,
    last4code: undefined,
    appleId: undefined, // same as email
    password: undefined,
    stepWait: 10,
    payBill: payBillType.alipay,
    payInstallment: 0,
    cityName: undefined,
    districtName: undefined,
    provinceName: undefined,
    employeeId: undefined
}

const getPageInitInfo = async () => {
    let partNumber, x_aos_stk
    const initData = document.getElementById('init_data')?.textContent
    const initDataJson: AnyObj = initData ? JSON.parse(initData) : {}
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
        let shopBagResText = (await GMfetch({
            url: applePageUrl.shoppingCart,
            options: {
                method: 'GET',
            },
            isText: true,
        })) as string

        partNumber = shopBagResText?.match(/(?<=productEvar1\"\:"Cart\|\|)([a-zA-Z0-9]+\/A)/g)?.[0]
    }

    // console.log(`partNumber`, partNumber)
    return {
        partNumber,
        x_aos_stk,
    }
}

/*
 *   @partNumber iPhone 型号
 *   @isNoWait 是否等待，不等待表示纯粹调用接口
 */
const getStoreCanPickInfo = async (partNumber: string, isNoWait?: boolean) => {
    let pickupStoreInfo: AnyObj = {}
    const { host, protocol } = window.location || {}
    let url = `${protocol}//www.apple.com.cn/shop/fulfillment-messages`

    const districtName = iPhoneOrderConfig.districtName || defaultAres.districtName
    const provinceName = iPhoneOrderConfig.provinceName || defaultAres.provinceName
    const cityName = iPhoneOrderConfig.cityName || defaultAres.cityName
    let reqQuery = {
        'parts.0': partNumber, // 型号 `MQ8G3CH/A`,
        'mts.0': `regular`,
        pl: true,
        location: `${provinceName} ${cityName} ${districtName}`, // `闵行区`,
        geoLocated: false,
        state: provinceName,
        city: cityName,
        district: districtName,
    }

    const querystring = _.map(reqQuery, (value, key) => {
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
        let resJson = (await GMfetch({ url, options })) as AnyObj

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
                    const iPhoneProAll = iPhone_PartNumber_Types.pro
                    const randomPartNumberiPhonePro = iPhoneProAll[Math.floor(Math.random() * iPhoneProAll.length)]
                    await getStoreCanPickInfo(randomPartNumberiPhonePro, true)
                    await sleep(60)
                }
            } else {
                console.log(`********** GMfetch failed, NoWait failed **********`)
            }
        }

        let partPickupStores = pickupMessage?.stores || [],
            pickupNumbers = ''
        _.each(partPickupStores, store => {
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
            const iPhoneProAll = iPhone_PartNumber_Types.pro
            const randomPartNumberiPhonePro = iPhoneProAll[Math.floor(Math.random() * iPhoneProAll.length)]
            await getStoreCanPickInfo(randomPartNumberiPhonePro, true)
            await sleep(10)
        } else {
            console.log(`********** GMfetch failed, NoWait failed **********`)
        }
    }

    console.log(`pickupStoreInfo`, pickupStoreInfo)
    return pickupStoreInfo
}

const doFroApplePages = async (url?: string) => {
    await sleep(0.5)

    let queryString = location.search
    let pathname = location.pathname
    console.log(`doFroApplePages`, queryString)

    // 登陆态过期，直接去购物车页
    if (/\/shop\/sorry/i.test(pathname)) {
        location.href = applePageUrl.shoppingCart
        return
    }

    // 在购物车页面
    if (pathname == `/shop/bag`) {
        let goCheckoutBtn: HTMLElement | null = document.getElementById(pageElementsId.shoppingCart.checkoutButton)
        if (!goCheckoutBtn && url) {
            location.href = url
            return
        }
        goCheckoutBtn?.click()
        return
    }

    // 在登陆页
    if (/\/signin/i.test(pathname)) {
        if (iPhoneOrderConfig.appleId && iPhoneOrderConfig.password) {
            let addIdDom = document.getElementById(pageElementsId.signIn.appleIdInput) as HTMLInputElement
            let addCodeDom = document.getElementById(pageElementsId.signIn.applePasswordInput) as HTMLInputElement
            let goLoginBtn = document.getElementById(pageElementsId.signIn.loginSubmitButton)
            if (addIdDom && addCodeDom && goLoginBtn) {
                changeInputValue(addIdDom, iPhoneOrderConfig.appleId)
                changeInputValue(addCodeDom, iPhoneOrderConfig.password)
                goLoginBtn.click()
            }
        } else {
            // 没有账号信息就以游客登录
            let guestLoginBtn = document.getElementById(pageElementsId.signIn.guestLoginButon)
            if (guestLoginBtn) {
                guestLoginBtn.click()
            }
        }
        return
    }

    if (pathname == `/shop/checkout`) {
        console.log(`I am in checkout steps`)
        // 选择门店
        if (queryString.search(/_s=fulfillment/i) > -1) {
            let iwantpickup = document.getElementById(pageElementsId.checkout.fulfillment.selectPickupButton)
            if (!iwantpickup && url) {
                location.href = url
                return
            }
            iwantpickup?.click()

            let pageInfo = await getPageInitInfo()
            const { partNumber, x_aos_stk } = pageInfo || {}

            if (!partNumber || !x_aos_stk) {
                // 当前页面没有信息， 则刷新一下
                await sleep(iPhoneOrderConfig.stepWait, 'wait and reload')
                location.reload()
                return
            } else {
                await goOrderSteps({
                    partNumber,
                    x_aos_stk,
                })
            }
        }

        // 填写取货信息，个人信息 页面
        if (queryString.search(/_s=pickupcontact/i) > -1) {
            let checkoutSelectPrefix = `checkout.pickupContact.selfPickupContact.selfContact.address`
            let lastNameDom = document.getElementById(
                    pageElementsId.checkout.pickupContact.lastName
                ) as HTMLInputElement,
                firstNameDom = document.getElementById(
                    pageElementsId.checkout.pickupContact.firstName
                ) as HTMLInputElement,
                emailAddressDom = document.getElementById(
                    pageElementsId.checkout.pickupContact.emailAddress
                ) as HTMLInputElement,
                mobileDom = document.getElementById(pageElementsId.checkout.pickupContact.mobile) as HTMLInputElement,
                last4IdDom = document.getElementById(pageElementsId.checkout.pickupContact.last4Id) as HTMLInputElement
            // 如果当前dom不存在，说明此时页面还没有加载出来，直接刷新页面加载
            if (!lastNameDom && url) {
                location.href = url
                return
            }
            changeInputValue(lastNameDom, iPhoneOrderConfig.lastName)
            changeInputValue(firstNameDom, iPhoneOrderConfig.firstName)
            changeInputValue(emailAddressDom, iPhoneOrderConfig.appleId)
            changeInputValue(mobileDom, iPhoneOrderConfig.mobile)
            changeInputValue(last4IdDom, iPhoneOrderConfig.last4code)
            document.getElementById(pageElementsId.checkout.continuebutton)?.click()
            // document.querySelector(`#rs-checkout-continue-button-bottom`).click()
            return
        }

        // 选择付款方式页面
        if (queryString.search(/_s=billing/i) > -1) {
            let alipayBtnInput = document.getElementById(pageElementsId.checkout.bill.alipay)
            let wechatpayBtnInput = document.getElementById(pageElementsId.checkout.bill.wechat)
            if (alipayBtnInput) {
                alipayBtnInput.click()
            } else if (wechatpayBtnInput) {
                wechatpayBtnInput.click()
            } else if (url) {
                // 如果既没有支付宝，又没有微信，说明页面加载没好，直接刷新
                location.href = url
                return
            }
            document.getElementById(pageElementsId.checkout.continuebutton)?.click()
            return
        }

        // 结账review页面
        if (queryString.search(/_s=review/i) > -1) {
            let orderBtn = document.getElementById(pageElementsId.checkout.continuebutton)
            if (orderBtn) {
                orderBtn.click()
            } else if (url) {
                // 如果既没有去支付按钮，说明页面加载没好，直接刷新
                location.href = url
                return
            }

            return
        }
    }
}

const checkoutSteps = async (step: string, x_aos_stk: string, stepInfo: AnyObj) => {
    const { host, protocol } = window.location || {}
    const districtName = iPhoneOrderConfig.districtName || defaultAres.districtName
    const provinceName = iPhoneOrderConfig.provinceName || defaultAres.provinceName
    const cityName = iPhoneOrderConfig.cityName || defaultAres.cityName

    let url = `${protocol}//${host}/shop/checkoutx?` // checkout.fulfillment`

    let data = [],
        result,
        resJson,
        dataString: string
    let options = {
        method: 'POST',
        headers: {
            ...fetchHeaders,
            'x-aos-model-page': 'checkoutPage',
            'x-aos-stk': x_aos_stk,
            referrer: `${protocol}//${host}/shop/checkout?_s=Fulfillment-init`,
        },
    }
    if (step == CHECKOUT_STEPS.selectStore) {
        console.log(`this step is`, `selectStore`)
        url += step

        const { storeNumber, district = districtName } = stepInfo || {}
        data = [
            `checkout.fulfillment.pickupTab.pickup.storeLocator.showAllStores=false`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.selectStore=${storeNumber}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.searchInput=${encodeURIComponent(
                provinceName + ' ' + cityName + ' ' + district
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.city=${encodeURIComponent(
                cityName
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.state=${encodeURIComponent(
                provinceName
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.provinceCityDistrict=${encodeURIComponent(
                provinceName + ' ' + district
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.countryCode=CN`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.district=${encodeURIComponent(
                district
            )}`,
        ]
        dataString = data.join(`&`)
        result = await fetch(url, {
            ...options,
            body: dataString,
        })
        resJson = await result.json()
        console.log(`resJson`, resJson)
        const { fulfillment } = resJson?.body?.checkout || {}
        const { pickUpDates, timeSlotWindows } = fulfillment?.pickupTab?.pickup?.timeSlot?.dateTimeSlots?.d || {}

        if (_.isEmpty(timeSlotWindows)) return {}

        let dayRadio,
            selectTimeSLot: AnyObj = {}
        _.each(timeSlotWindows, (timeSlotWindowItem, selectedIndex) => {
            selectTimeSLot = {}
            dayRadio = _.keys(timeSlotWindowItem)?.[0]
            let timeSlotLit = timeSlotWindowItem[dayRadio] || []
            if (timeSlotLit?.length) {
                selectTimeSLot = _.find(timeSlotLit, timeSlot => {
                    return (
                        timeSlot?.Label &&
                        (/^12\:/.test(timeSlot.Label) || /^19\:/.test(timeSlot.Label) || /^20\:/.test(timeSlot.Label))
                    )
                })

                if (!selectTimeSLot) {
                    selectTimeSLot = timeSlotLit[Math.floor((timeSlotLit.length * 7) / 8)]
                }
                if (pickUpDates[selectedIndex]?.date && pickUpDates[selectedIndex]?.date.indexOf(dayRadio) > -1) {
                    selectTimeSLot.date = pickUpDates[selectedIndex]?.date
                } else {
                    let now = new Date()
                    selectTimeSLot.date = [
                        now.getFullYear(),
                        now.getMonth() < 10 ? `0${now.getMonth()}` : now.getMonth(),
                        dayRadio,
                    ].join('-')
                }

                selectTimeSLot.dayRadio = dayRadio
                return false
            }
        })

        return {
            pickUpDates,
            timeSlotWindows,
            timeSlot: selectTimeSLot,
            isSuccess: !_.isEmpty(selectTimeSLot),
        }
    }
    if (step == CHECKOUT_STEPS.selectPickupTime) {
        console.log(`this step is`, `selectPickupTime`)
        url += step
        const {
            storeNumber,
            district = districtName,
            checkInStart,
            checkInEnd,
            date,
            SlotId,
            signKey,
            timeZone,
            timeSlotValue,
            dayRadio,
            isRestricted,
        } = stepInfo || {}

        data = [
            `checkout.fulfillment.fulfillmentOptions.selectFulfillmentLocation=RETAIL`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.showAllStores=false`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.selectStore=${storeNumber}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.searchInput=${encodeURIComponent(
                provinceName + ' ' + cityName + ' ' + district
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.city=${encodeURIComponent(
                cityName
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.state=${encodeURIComponent(
                provinceName
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.provinceCityDistrict=${encodeURIComponent(
                provinceName + ' ' + district
            )}`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.countryCode=CN`,
            `checkout.fulfillment.pickupTab.pickup.storeLocator.address.stateCitySelectorForCheckout.district=${encodeURIComponent(
                district
            )}`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.startTime=${encodeURIComponent(
                checkInStart
            )}`, // checkInStart = "01:00 PM",
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.displayEndTime=`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.isRecommended=false`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.endTime=${encodeURIComponent(checkInEnd)}`, // endTime = '01:15 PM',
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.date=${encodeURIComponent(date)}`, // data = '2022-09-23',
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.timeSlotId=${encodeURIComponent(SlotId)}`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.signKey=${encodeURIComponent(signKey)}`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.timeZone=${encodeURIComponent(timeZone)}`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.timeSlotValue=${encodeURIComponent(
                timeSlotValue
            )}`, // 23-13:00-13:15`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.dayRadio=${dayRadio}`, // dayRadio = 23
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.isRestricted=${
                isRestricted ? String(isRestricted) : ''
            }`,
            `checkout.fulfillment.pickupTab.pickup.timeSlot.dateTimeSlots.displayStartTime=`,
        ]
        dataString = data.join(`&`)
        result = await fetch(url, {
            ...options,
            body: dataString,
        })
        resJson = await result.json()
        const { status } = resJson?.head || {}
        const isSuccess = status == 200
        return { isSuccess }
    }
    if (step == CHECKOUT_STEPS.pickupContact) {
        console.log(`this step is`, `pickupContact`)
        url += step
        const { lastName, firstName, emailAddress, fullDaytimePhone, nationalIdSelf } = stepInfo || {}
        data = [
            `checkout.pickupContact.selfPickupContact.selfContact.address.lastName=${encodeURIComponent(lastName)}`,
            `checkout.pickupContact.selfPickupContact.selfContact.address.firstName=${encodeURIComponent(firstName)}`,
            `checkout.pickupContact.selfPickupContact.selfContact.address.emailAddress=${encodeURIComponent(
                emailAddress
            )}`,
            `checkout.pickupContact.selfPickupContact.selfContact.address.fullDaytimePhone=${fullDaytimePhone}`,
            `checkout.pickupContact.selfPickupContact.nationalIdSelf.nationalIdSelf=${nationalIdSelf}`,
            `checkout.pickupContact.eFapiaoSelector.selectFapiao=none`,
        ]
        dataString = data.join(`&`)
        result = await fetch(url, {
            ...options,
            body: dataString,
        })
        resJson = await result.json()
        const { status } = resJson?.head || {}

        const { billing } = resJson?.body?.checkout || {}
        const { billingOptions } = billing || {}
        const allBillingOptions = billingOptions?.d?.options || []

        const isSuccess = status == 200
        return {
            isSuccess,
            allBillingOptions,
        }
    }

    if (step == CHECKOUT_STEPS.selectBill) {
        console.log(`this step is`, `selectBill`)
        url += step
        const { billOption, billInstallment } = stepInfo || {}
        data = [
            `checkout.billing.billingOptions.selectBillingOption=${billOption}`, // ALIPAY
            `checkout.locationConsent.locationConsent=true`,
        ]
        if (!isNaN(billInstallment)) {
            // data.splice(1, 0, "3234")
            data.splice(
                1,
                0,
                `checkout.billing.billingOptions.selectedBillingOptions.installments.installmentOptions.selectInstallmentOption=${billInstallment}`
            )
        }
        dataString = data.join(`&`)
        result = await fetch(url, {
            ...options,
            body: dataString,
        })
        resJson = await result.json()
        const { status } = resJson?.head || {}
        const { billing } = resJson?.body?.checkout || {}
        const isSuccess = status == 200
        const installmentOptions =
            billing?.billingOptions?.selectedBillingOptions?.installments?.installmentOptions?.d?.options || []
        return {
            isSuccess,
            installmentOptions,
        }
    }

    if (step == CHECKOUT_STEPS.checkoutBill) {
        console.log(`this step is`, `checkoutBill`)
        url += step
        const { billOption, billInstallment } = stepInfo || {}
        data = [
            `checkout.billing.billingOptions.selectBillingOption=${billOption}`, // ALIPAY
        ]
        if (billInstallment > 0) {
            data.push(
                `checkout.billing.billingOptions.selectedBillingOptions.installments.installmentOptions.selectInstallmentOption=${billInstallment}`
            )
        }

        dataString = data.join(`&`)
        result = await fetch(url, {
            ...options,
            body: dataString,
        })
        resJson = await result.json()
        const { status } = resJson?.head || {}
        const isSuccess = status == 200
        return { isSuccess }
    }

    if (step == CHECKOUT_STEPS.placeOrder) {
        console.log(`this step is`, `placeOrder`)
        url += step
        result = await fetch(url, {
            ...options,
        })
        resJson = await result.json()
        const { status, data } = resJson?.head || {}
        const isSuccess = status == 200 || status == 302 || status == 301 || false
        if (isSuccess) {
            try {
                let text = encodeURIComponent(`抢到了！！！快去付钱\r\n账号：${iPhoneOrderConfig.appleId || ''}`)
                // TODO: 推送消息
                if(iPhoneOrderConfig.employeeId){
                    GMfetch({
                        url: `https://m.fat67.qa.nt.ctripcorp.com/function/immessage?&msg=${text}&rcv=${iPhoneOrderConfig.employeeId}`,
                        options: {
                            method: 'GET',
                        },
                        isText: true,
                    })
                }
            } catch (e) {
                console.log(`GMfetch error`)
            }
        }
        return {
            isSuccess,
            url: data?.url || '',
        }
    }
}

const goOrderSteps = async ({
    partNumber,
    x_aos_stk,
    count,
}: {
    partNumber: string
    x_aos_stk: string
    count?: number
}) => {
    count = count || 0 // 重试次数
    // 获取可以提货的商店信息
    let pickupStoreInfo = await getStoreCanPickInfo(partNumber)
    let storeNumber = pickupStoreInfo.storeNumber
    const { host, protocol } = location || {}

    if (storeNumber) {
        // 走第一步， 选店，获取提货时间
        let canPickupTime = await checkoutSteps(CHECKOUT_STEPS.selectStore, x_aos_stk, {
            storeNumber,
        })
        console.log(`firstStep:`, canPickupTime)

        const timeSlot = canPickupTime?.timeSlot as AnyObj
        if (_.isEmpty(timeSlot)) return

        // 第二步， 选日期时间
        let pickupTimeInStore = await checkoutSteps(CHECKOUT_STEPS.selectPickupTime, x_aos_stk, {
            storeNumber,
            ...timeSlot,
        })

        if (!pickupTimeInStore?.isSuccess) return

        // 第三步 填写证件信息
        let addContactResult = await checkoutSteps(CHECKOUT_STEPS.pickupContact, x_aos_stk, {
            lastName: iPhoneOrderConfig.lastName,
            firstName: iPhoneOrderConfig.firstName,
            emailAddress: iPhoneOrderConfig.appleId,
            fullDaytimePhone: iPhoneOrderConfig.mobile,
            nationalIdSelf: iPhoneOrderConfig.last4code,
        })
        const { allBillingOptions } = addContactResult || {}

        if (!addContactResult?.isSuccess) return

        let selectBillType = BILL_OPTIONS_TYPE[iPhoneOrderConfig.payBill] || BILL_OPTIONS_TYPE.alipay
        let selectBillValue = 'ALIPAY'

        if (!_.isEmpty(allBillingOptions)) {
            _.each(allBillingOptions, bill_option => {
                const { label, labelImageAlt, a11yLabel, value } = bill_option || {}
                const labelText = label || labelImageAlt || a11yLabel || ''
                if (labelText.indexOf(selectBillType) > -1) {
                    selectBillValue = value || 'ALIPAY'
                    return false
                }
            })
        }
        // 第四步一， 选择付款方式
        let addBill = await checkoutSteps(CHECKOUT_STEPS.selectBill, x_aos_stk, {
            billOption: selectBillValue,
            billInstallment: iPhoneOrderConfig.payInstallment, // 分期
        })

        if (!addBill?.isSuccess) return

        if (iPhoneOrderConfig.payInstallment && iPhoneOrderConfig.payInstallment > 0) {
            const { installmentOptions = [] } = addBill || {}
            // 判断传入的分期是否合法
            let isPayInstallmentValidated = _.some(installmentOptions, item => {
                return item?.value == iPhoneOrderConfig.payInstallment
            })
            if (!isPayInstallmentValidated) {
                iPhoneOrderConfig.payInstallment = installmentOptions[installmentOptions?.length - 1]?.value || 0
            }
        }

        let confirmBillStepsInfo: AnyObj = {
            billOption: selectBillValue,
        }
        if (iPhoneOrderConfig.payInstallment) {
            confirmBillStepsInfo = {
                ...confirmBillStepsInfo,
                billInstallment: iPhoneOrderConfig.payInstallment, // 分期
            }
        }
        // 第四步二，确认付款方式
        let confirmBill = await checkoutSteps(CHECKOUT_STEPS.checkoutBill, x_aos_stk, {
            ...confirmBillStepsInfo,
        })

        if (!confirmBill?.isSuccess) return

        // 最后下单
        let placeOrderRes = await checkoutSteps(CHECKOUT_STEPS.placeOrder, x_aos_stk, {})

        if (placeOrderRes?.isSuccess) {
            let jumpUrl = `${protocol}//${host}/shop/checkout/interstitial`
            if (placeOrderRes?.url) {
                // `${protocol}//${host}/shop/checkout/status`
                jumpUrl = `${protocol}//${host}${placeOrderRes.url || ''}`
            }

            location.href = jumpUrl
        }
    } else if (count > afterCountThenReload) {
        await sleep(1, `goOrderSteps failed over ${afterCountThenReload} times, then reload page`)
        location.reload()
    } else {
        await sleep(
            iPhoneOrderConfig.stepWait,
            `goOrderSteps again, count: ${count}, limit times: ${afterCountThenReload}`
        )
        await goOrderSteps({ partNumber, x_aos_stk, count: count + 1 })
    }
}

const iPhoneMonkey = async (history: History, config?: AnyObj) => {
    // 初始化配置项
    iPhoneOrderConfig = {
        ...iPhoneOrderConfig,
        ...window.iPhoneOrderConfig,
        ...config,
    }

    console.log(`iPhoneOrderConfig`, iPhoneOrderConfig)
    if (!iPhoneOrderConfig.appleId) return
    await doFroApplePages()

    // 重写pushStae方法，用来监听
    let pushState = history.pushState
    history.pushState = async function (state) {
        if (typeof history.onpushstate == 'function') {
            history.onpushstate({ state: state })
        }

        console.log(`arguments`, arguments)
        let url = arguments[2] || ''
        url = url && url.search(/^http/) > -1 ? url : ''
        // @ts-ignore
        let pushResult = pushState.apply(history, arguments)

        await doFroApplePages(url)
        console.log(`history`, history.length, location.href)
        return pushResult
    }
}

export default iPhoneMonkey
