import getStoreCanPickInfo from './getStoreCanPickInfo'
import checkoutSteps from './checkoutSteps'
import type { IPHONEORDER_CONFIG } from '../../shared/interface'
import { CHECKOUT_STEPS, BILL_OPTIONS_TYPE, iframeMessagePass } from '../../shared/constants'
import { sleep } from '../../shared/util'
import { isEmpty as _isEmpty, each as _each, some as _some } from 'lodash'

interface IGoOrderSteps {
    partNumber: string
    x_aos_stk: string
    count?: number
    iPhoneOrderConfig: IPHONEORDER_CONFIG
}

const goOrderSteps = async ({ partNumber, x_aos_stk, count, iPhoneOrderConfig }: IGoOrderSteps) => {
    count = count || 1 // 重试次数
    const { afterCountThenReload = 50 } = iPhoneOrderConfig || {}
    // ********** 发送消息给 tips page **********
    const iframeWindow = (document?.getElementById(iframeMessagePass.iframeID) as HTMLIFrameElement)?.contentWindow
    const message = { action: iframeMessagePass.messageAction, count: count, beforeReload: afterCountThenReload }
    iframeWindow?.postMessage(message, '*')

    // 获取可以提货的商店信息
    let pickupStoreInfo = await getStoreCanPickInfo({ x_aos_stk, partNumber, iPhoneOrderConfig })

    const { storeNumber, availableNowForAllLines } = pickupStoreInfo || {}
    const { host, protocol } = location || {}

    if (storeNumber) {
        // 走第一步， 选店，获取提货时间
        let canPickupTime = await checkoutSteps({
            step: CHECKOUT_STEPS.selectStore,
            x_aos_stk,
            stepInfo: {
                storeNumber,
            },
            iPhoneOrderConfig,
        })
        console.log(`firstStep:`, canPickupTime)

        const timeSlot = canPickupTime?.timeSlot as Record<string, any>
        const noNeedTimeSlot = canPickupTime?.noNeedTimeSlot
        const canPickup = canPickupTime?.isSuccess
        if (!canPickup) return

        if (noNeedTimeSlot) {
            // 所有时间可取货，直接走 checkoutFulfillment
            let canCheckout = await checkoutSteps({
                noNeedTimeSlot,
                step: CHECKOUT_STEPS.checkoutFulfillment,
                x_aos_stk,
                stepInfo: {
                    storeNumber,
                },
                iPhoneOrderConfig,
            })

            if (!canCheckout?.isSuccess) return
        } else {
            // 第二步， 选日期时间
            let pickupTimeInStore = await checkoutSteps({
                step: CHECKOUT_STEPS.selectPickupTime,
                noNeedTimeSlot,
                x_aos_stk,
                stepInfo: {
                    storeNumber,
                    ...timeSlot,
                },
                iPhoneOrderConfig,
            })

            if (!pickupTimeInStore?.isSuccess) return
        }
        // 第三步 填写证件信息
        let addContactResult = await checkoutSteps({
            step: CHECKOUT_STEPS.pickupContact,
            x_aos_stk,
            stepInfo: {
                lastName: iPhoneOrderConfig.lastName,
                firstName: iPhoneOrderConfig.firstName,
                emailAddress: iPhoneOrderConfig.appleId,
                fullDaytimePhone: iPhoneOrderConfig.mobile,
                nationalIdSelf: iPhoneOrderConfig.last4code,
            },
            iPhoneOrderConfig,
        })
        const { allBillingOptions } = addContactResult || {}

        if (!addContactResult?.isSuccess) return

        let selectBillType = BILL_OPTIONS_TYPE[iPhoneOrderConfig.payBill] || BILL_OPTIONS_TYPE.alipay
        let selectBillValue = 'ALIPAY'

        if (!_isEmpty(allBillingOptions)) {
            _each(allBillingOptions, bill_option => {
                const { label, labelImageAlt, a11yLabel, value } = bill_option || {}
                const labelText = label || labelImageAlt || a11yLabel || ''
                if (labelText.indexOf(selectBillType) > -1) {
                    selectBillValue = value || 'ALIPAY'
                    return false
                }
            })
        }
        // 第四步一， 选择付款方式
        let addBill = await checkoutSteps({
            step: CHECKOUT_STEPS.selectBill,
            x_aos_stk,
            stepInfo: {
                billOption: selectBillValue,
                billInstallment: iPhoneOrderConfig.payInstallment, // 分期
            },
            iPhoneOrderConfig,
        })

        if (!addBill?.isSuccess) return

        if (iPhoneOrderConfig.payInstallment && iPhoneOrderConfig.payInstallment > 0) {
            const { installmentOptions = [] } = addBill || {}
            // 判断传入的分期是否合法
            let isPayInstallmentValidated = _some(installmentOptions, item => {
                return item?.value == iPhoneOrderConfig.payInstallment
            })
            if (!isPayInstallmentValidated) {
                iPhoneOrderConfig.payInstallment = installmentOptions[installmentOptions?.length - 1]?.value || 0
            }
        }

        let confirmBillStepsInfo: Record<string, any> = {
            billOption: selectBillValue,
        }
        if (iPhoneOrderConfig.payInstallment) {
            confirmBillStepsInfo = {
                ...confirmBillStepsInfo,
                billInstallment: iPhoneOrderConfig.payInstallment, // 分期
            }
        }
        // 第四步二，确认付款方式
        let confirmBill = await checkoutSteps({
            step: CHECKOUT_STEPS.checkoutBill,
            x_aos_stk,
            stepInfo: {
                ...confirmBillStepsInfo,
            },
            iPhoneOrderConfig,
        })

        if (!confirmBill?.isSuccess) return

        // 最后下单
        let placeOrderRes = await checkoutSteps({
            step: CHECKOUT_STEPS.placeOrder,
            x_aos_stk,
            stepInfo: {},
            iPhoneOrderConfig,
        })

        if (placeOrderRes?.isSuccess) {
            let jumpUrl = `${protocol}//${host}/shop/checkout/interstitial`
            if (placeOrderRes?.url) {
                // `${protocol}//${host}/shop/checkout/status`
                jumpUrl = `${protocol}//${host}${placeOrderRes.url || ''}`
            }

            location.href = jumpUrl
        }
    } else if (count >= afterCountThenReload) {
        await sleep(1, `goOrderSteps failed over ${afterCountThenReload} times, then reload page`)
        location.reload()
    } else {
        await sleep(
            iPhoneOrderConfig.stepWait,
            `goOrderSteps again, count: ${count}, limit times: ${afterCountThenReload}`
        )
        await goOrderSteps({ partNumber, x_aos_stk, count: count + 1, iPhoneOrderConfig })
    }
}

export default goOrderSteps
