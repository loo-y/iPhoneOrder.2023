import { sleep, changeInputValue } from '@/app/shared/util'
import { applePageUrl, pageElementsId, BILL_OPTIONS_TYPE } from '@/app/shared/constants'
import type { IPHONEORDER_CONFIG } from '@/app/shared/interface'
import { mapValues as _mapValues } from 'lodash'
const payBillType = _mapValues(BILL_OPTIONS_TYPE, (v, k) => {
    return k
})

let iPhoneOrderConfig: IPHONEORDER_CONFIG = {
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
    employeeId: undefined,
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
    if (/\/shop\/bag/i.test(pathname)) {
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
}

export default doFroApplePages
