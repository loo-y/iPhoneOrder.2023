import { sleep, changeInputValue, getElemByID } from '@/app/shared/util'
import { applePageUrl, pageElementsId, storeKeys } from '@/app/shared/constants'
import type { IPHONEORDER_CONFIG } from '@/app/shared/interface'
import getPageInitInfo from './getPageInitInfo'
import goOrderSteps from './goOrderSteps'
import { mapValues as _mapValues } from 'lodash'
import { restoreFromStorage } from '@/app/shared/util'

// let iPhoneOrderConfig: IPHONEORDER_CONFIG = {
//     lastName: undefined,
//     firstName: undefined,
//     mobile: undefined,
//     last4code: undefined,
//     appleId: undefined, // same as email
//     password: undefined,
//     stepWait: 10,
//     // @ts-ignore
//     payBill: billTypeKeys.alipay,
//     payInstallment: 0,
//     cityName: undefined,
//     districtName: undefined,
//     provinceName: undefined,
//     employeeId: undefined,
// }

const doFroApplePages = async (url?: string) => {
    const orderEnabled = !!(await restoreFromStorage(storeKeys.orderEnabled))
    console.log(`orderEnabled in doForApplePages`, orderEnabled)
    if (!orderEnabled) return

    const iPhoneOrderConfig: IPHONEORDER_CONFIG = await restoreFromStorage(storeKeys.orderConfig)
    await sleep(0.5)

    let queryString = new URLSearchParams(location.search.toLowerCase())
    let pathname = location.pathname
    console.log(`doFroApplePages`, queryString)

    const { checkout: checkoutElems, shoppingCart: shoppingCartElems, signIn: signInElems } = pageElementsId

    // 登陆态过期，直接去购物车页
    if (/\/shop\/sorry/i.test(pathname)) {
        location.href = applePageUrl.shoppingCart
        return
    }

    // 在购物车页面
    if (/\/shop\/bag/i.test(pathname)) {
        let goCheckoutBtn: HTMLElement | null = getElemByID(shoppingCartElems.checkoutButton)
        if (!goCheckoutBtn && url) {
            location.href = url
            return
        }
        // await sleep(Math.random() * 2)
        goCheckoutBtn?.click()
        return
    }

    // 在登陆页
    if (/\/signin/i.test(pathname)) {
        if (getElemByID(signInElems.dataHandleByAppleCheckbox)) {
            const dataHandleByAppleCheckbox = getElemByID(signInElems.dataHandleByAppleCheckbox) as HTMLInputElement
            const dataOutSideMyCountryCheckbox = getElemByID(
                signInElems.dataOutSideMyCountryCheckbox
            ) as HTMLInputElement
            dataHandleByAppleCheckbox.click()
            dataHandleByAppleCheckbox.checked = true
            dataOutSideMyCountryCheckbox.click()
            dataOutSideMyCountryCheckbox.checked = true
            getElemByID(signInElems.acceptButton)?.click()
            await sleep(0.5)
        }

        if (iPhoneOrderConfig.appleId && iPhoneOrderConfig.password) {
            let addIdDom = getElemByID(signInElems.appleIdInput) as HTMLInputElement
            let addCodeDom = getElemByID(signInElems.applePasswordInput) as HTMLInputElement
            let goLoginBtn = getElemByID(signInElems.loginSubmitButton)
            if (addIdDom && addCodeDom && goLoginBtn) {
                changeInputValue(addIdDom, iPhoneOrderConfig.appleId)
                changeInputValue(addCodeDom, iPhoneOrderConfig.password)
                goLoginBtn.click()
            }
        } else {
            // 没有账号信息就以游客登录
            let guestLoginBtn = getElemByID(signInElems.guestLoginButon)
            if (guestLoginBtn) {
                console.log(`click guestLoginBtn`, guestLoginBtn)
                guestLoginBtn.click()
            }
        }
        return
    }

    if (/\/shop\/checkout/.test(pathname)) {
        console.log(`I am in checkout steps`)
        const s_value = queryString.get('_s') || ''
        // 选择门店
        if (s_value.includes('fulfillment')) {
            let iwantpickup = getElemByID(checkoutElems.fulfillment.selectPickupButton)
            if (!iwantpickup && url) {
                location.href = url
                return
            }
            iwantpickup?.click()

            let pageInfo = await getPageInitInfo()
            const { partNumber, x_aos_stk } = pageInfo || {}
            console.log(`partNumber, x_aos_stk`, partNumber, x_aos_stk)
            if (!partNumber || !x_aos_stk) {
                // 当前页面没有信息， 则刷新一下
                await sleep(iPhoneOrderConfig.stepWait, 'wait and reload')
                location.reload()
                return
            } else {
                await goOrderSteps({
                    partNumber,
                    x_aos_stk,
                    iPhoneOrderConfig,
                })
            }
        }

        // 填写取货信息，个人信息 页面
        if (s_value.includes('pickupcontact')) {
            let checkoutSelectPrefix = `checkout.pickupContact.selfPickupContact.selfContact.address`

            let lastNameDom = getElemByID(checkoutElems.pickupContact.lastName) as HTMLInputElement,
                firstNameDom = getElemByID(checkoutElems.pickupContact.firstName) as HTMLInputElement,
                emailAddressDom = getElemByID(checkoutElems.pickupContact.emailAddress) as HTMLInputElement,
                mobileDom = getElemByID(checkoutElems.pickupContact.mobile) as HTMLInputElement,
                last4IdDom = getElemByID(checkoutElems.pickupContact.last4Id) as HTMLInputElement
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
            getElemByID(checkoutElems.continuebutton)?.click()
            // document.querySelector(`#rs-checkout-continue-button-bottom`).click()
            return
        }

        // 选择付款方式页面
        if (s_value.includes('billing')) {
            let alipayBtnInput = getElemByID(checkoutElems.bill.alipay)
            let wechatpayBtnInput = getElemByID(checkoutElems.bill.wechat)
            if (alipayBtnInput) {
                alipayBtnInput.click()
            } else if (wechatpayBtnInput) {
                wechatpayBtnInput.click()
            } else if (url) {
                // 如果既没有支付宝，又没有微信，说明页面加载没好，直接刷新
                location.href = url
                return
            }
            getElemByID(checkoutElems.continuebutton)?.click()
            return
        }

        // 结账review页面
        if (s_value.includes('review')) {
            let orderBtn = getElemByID(checkoutElems.continuebutton)
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

export default doFroApplePages
