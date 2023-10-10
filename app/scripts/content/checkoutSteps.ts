import { IPHONEORDER_CONFIG, VOICE_OBJ } from '../../shared/interface'
import { fetchHeaders, defaultAres, CHECKOUT_STEPS } from '../../shared/constants'
import crossfetch from 'cross-fetch'
import sendSelfNotificatioin from './sendSelfNotificatioin'
import playSystemNotification from './playSystemNotifacation'
import { each as _each, map as _map, find as _find, isEmpty as _isEmpty, keys as _keys } from 'lodash'
const fetch = crossfetch.bind(this)

interface ICheckoutStepsProps {
    step: string
    x_aos_stk: string
    stepInfo: Record<string, any>
    iPhoneOrderConfig: IPHONEORDER_CONFIG
    noNeedTimeSlot?: boolean
}

const checkoutSteps = async ({ step, x_aos_stk, stepInfo, iPhoneOrderConfig, noNeedTimeSlot }: ICheckoutStepsProps) => {
    const { host, protocol } = window.location || {}
    const districtName = iPhoneOrderConfig.districtName || defaultAres.districtName
    const provinceName = iPhoneOrderConfig.provinceName || defaultAres.provinceName
    const cityName = iPhoneOrderConfig.cityName || defaultAres.cityName
    const provinceCityDistrict =
        provinceName == cityName ? cityName + ' ' + districtName : provinceName + ' ' + cityName + ' ' + districtName
    let url = `${protocol}//${host}/shop/checkoutx` // checkout.fulfillment`

    let data = [],
        result,
        resJson,
        dataString: string
    let options = {
        method: 'POST',
        headers: {
            ...fetchHeaders,
            'X-Aos-Model-Page': 'checkoutPage',
            'X-Aos-Stk': x_aos_stk,
            referrer: `${protocol}//${host}/shop/checkout?_s=Fulfillment-init`,
        },
        credentials: 'include' as RequestCredentials,
    }

    if (noNeedTimeSlot && step == CHECKOUT_STEPS.checkoutFulfillment) {
        console.log(`this step is`, `checkoutFulfillment`)
        url += step

        const { storeNumber, district = districtName } = stepInfo || {}
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
                provinceCityDistrict
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
        const { pickupContact } = resJson?.body?.checkout || {}
        const { status } = resJson?.head || {}
        const isSuccess = status == 200
        return { isSuccess, pickupContact }
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
                provinceCityDistrict
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
        const noNeedTimeSlot = _isEmpty(fulfillment?.pickupTab?.pickup?.timeSlot)
        const { pickUpDates, timeSlotWindows } = fulfillment?.pickupTab?.pickup?.timeSlot?.dateTimeSlots?.d || {}

        if (!noNeedTimeSlot && _isEmpty(timeSlotWindows)) return { isSuccess: false }

        let dayRadio,
            selectTimeSLot: Record<string, any> = {}
        _each(timeSlotWindows, (timeSlotWindowItem, selectedIndex) => {
            selectTimeSLot = {}
            dayRadio = _keys(timeSlotWindowItem)?.[0]
            let timeSlotLit = timeSlotWindowItem[dayRadio] || []
            if (timeSlotLit?.length) {
                selectTimeSLot = _find(timeSlotLit, timeSlot => {
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
            noNeedTimeSlot,
            isSuccess: noNeedTimeSlot || !_isEmpty(selectTimeSLot),
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
                provinceCityDistrict
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
                // TODO send message by API
                await playSystemNotification({ voiceInfo: iPhoneOrderConfig.voiceInfo })
                await sendSelfNotificatioin({ url: iPhoneOrderConfig.selfNotiAPI })
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

export default checkoutSteps
