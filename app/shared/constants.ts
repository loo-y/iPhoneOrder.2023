import { mapValues as _mapValues } from 'lodash'
import { IPHONEORDER_CONFIG } from './interface'
export const iPhoneModels = {
    iPhone15Pro: [
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '128GB', model: 'MTQ43CH/A' },
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '256GB', model: 'MTQ83CH/A' },
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '512GB', model: 'MTQD3CH/A' },
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '1TB', model: 'MTQH3CH/A' },

        { color: { value: 'white', text: '白色钛金属' }, capacity: '128GB', model: 'MTQ53CH/A' },
        { color: { value: 'white', text: '白色钛金属' }, capacity: '256GB', model: 'MTQ93CH/A' },
        { color: { value: 'white', text: '白色钛金属' }, capacity: '512GB', model: 'MTQE3CH/A' },
        { color: { value: 'white', text: '白色钛金属' }, capacity: '1TB', model: 'MTQJ3CH/A' },

        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '128GB', model: 'MTQ73CH/A' },
        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '256GB', model: 'MTQC3CH/A' },
        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '512GB', model: 'MTQG3CH/A' },
        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '1TB', model: 'MTQL3CH/A' },

        { color: { value: 'primary', text: '原色钛金属' }, capacity: '128GB', model: 'MTQ63CH/A' },
        { color: { value: 'primary', text: '原色钛金属' }, capacity: '256GB', model: 'MTQA3CH/A' },
        { color: { value: 'primary', text: '原色钛金属' }, capacity: '512GB', model: 'MTQF3CH/A' },
        { color: { value: 'primary', text: '原色钛金属' }, capacity: '1TB', model: 'MTQK3CH/A' },
    ],

    iPhone15ProMax: [
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '256GB', model: 'MU2N3CH/A' },
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '512GB', model: 'MU2T3CH/A' },
        { color: { value: 'black', text: '黑色钛金属' }, capacity: '1TB', model: 'MU2X3CH/A' },

        { color: { value: 'white', text: '白色钛金属' }, capacity: '256GB', model: 'MU2P3CH/A' },
        { color: { value: 'white', text: '白色钛金属' }, capacity: '512GB', model: 'MU2U3CH/A' },
        { color: { value: 'white', text: '白色钛金属' }, capacity: '1TB', model: 'MU2Y3CH/A' },

        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '256GB', model: 'MU2R3CH/A' },
        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '512GB', model: 'MU2W3CH/A' },
        { color: { value: 'blue', text: '蓝色钛金属' }, capacity: '1TB', model: 'MU613CH/A' },

        { color: { value: 'primary', text: '原色钛金属' }, capacity: '256GB', model: 'MU2Q3CH/A' },
        { color: { value: 'primary', text: '原色钛金属' }, capacity: '512GB', model: 'MU2V3CH/A' },
        { color: { value: 'primary', text: '原色钛金属' }, capacity: '1TB', model: 'MU603CH/A' },
    ],
}

// keys
export enum storeKeys {
    orderEnabled = `orderEnabled`,
    orderConfig = `orderConfig`,
}

export const applePageUrl = {
    shoppingCart: `https://www.apple.com.cn/shop/bag`,
    buyiPhone: `https://www.apple.com.cn/shop/buy-iphone`,
    shoppingCartWithoutHost: `/shop/bag`,
    buyiPhoneWithoutHost: `/shop/buy-iphone`,
}

export const Match_URL = `apple.com.cn`

// ********** 👇page Element👇 **********
const prefixCheckout = `checkout`
const prefixPickupContact = `${prefixCheckout}.pickupContact`
const prefixSelfPickupContact = `${prefixPickupContact}.selfPickupContact`
const prefixSelfContact = `${prefixSelfPickupContact}.selfContact`
const prefixAddressCheckout = `${prefixSelfContact}.address`

const prefixNationalIdSelf = `${prefixSelfPickupContact}.nationalIdSelf`

const prefixBill = `${prefixCheckout}.billing`
export const prefixBillingoptions = `${prefixBill}.billingoptions`

export const pageElementsId = {
    shoppingCart: {
        checkoutButton: `shoppingCart.actions.navCheckout`,
    },
    signIn: {
        appleIdInput: `signIn.customerLogin.appleId`,
        applePasswordInput: `signIn.customerLogin.password`,
        loginSubmitButton: `signin-submit-button`,
        guestLoginButon: `signIn.guestLogin.guestLogin`,
        dataHandleByAppleCheckbox: `signIn.consentOverlay.dataHandleByApple`,
        dataOutSideMyCountryCheckbox: `signIn.consentOverlay.dataOutSideMyCountry`,
        acceptButton: `consent-overlay-accept-button`,
    },
    checkout: {
        continuebutton: `rs-checkout-continue-button-bottom`,
        fulfillment: {
            selectPickupButton: `fulfillmentOptionButtonGroup1`,
        },
        pickupContact: {
            lastName: `${prefixAddressCheckout}.lastName`,
            firstName: `${prefixAddressCheckout}.firstName`,
            emailAddress: `${prefixAddressCheckout}.emailAddress`,
            mobile: `${prefixAddressCheckout}.fullDaytimePhone`,
            last4Id: `${prefixNationalIdSelf}.nationalIdSelf`,
        },
        bill: {
            alipay: `${prefixBillingoptions}.alipay`,
            wechat: `${prefixBillingoptions}.wechat`,
            huabei: `${prefixBillingoptions}.installments0001243254`,
            cmb: `${prefixBillingoptions}.installments0001321713`,
            ccb: `${prefixBillingoptions}.installments0000882476`,
            icbc: `${prefixBillingoptions}.installments0000833448`,
        },
    },
}

// ********** 👆page Element👆 **********

// 付款方式
export enum BILL_OPTIONS_TYPE {
    alipay = `支付宝`,
    wechat = `微信`,
    ccb = `建设银行`,
    cmb = `招商银行`,
    icbc = `工商银行`,
    huabei = `花呗`,
}

export const billTypeKeys = _mapValues(BILL_OPTIONS_TYPE, (v, k) => {
    return k
})
export const billItemList = [
    {
        id: billTypeKeys.alipay,
        name: BILL_OPTIONS_TYPE.alipay,
    },
    {
        id: billTypeKeys.wechat,
        name: BILL_OPTIONS_TYPE.wechat,
    },
    {
        id: billTypeKeys.ccb,
        name: BILL_OPTIONS_TYPE.ccb,
    },
    {
        id: billTypeKeys.cmb,
        name: BILL_OPTIONS_TYPE.cmb,
    },
    {
        id: billTypeKeys.icbc,
        name: BILL_OPTIONS_TYPE.icbc,
    },
    {
        id: billTypeKeys.huabei,
        name: BILL_OPTIONS_TYPE.huabei,
    },
]

export const defaultiPhoneOrderConfig: IPHONEORDER_CONFIG = {
    stepWait: 10,
    // @ts-ignore
    payBill: billTypeKeys.alipay,

    afterCountThenReload: 50, // 重试次数超过之后重新刷新页面

    voiceInfo: {
        text: `抢到了`,
        times: 3,
    },
}

export const defaultPayinstallmentTotal = [
    {
        id: 0,
        name: '不分期',
    },
    {
        id: 3,
        name: '3期',
        includes: [billTypeKeys.ccb, billTypeKeys.cmb, billTypeKeys.huabei, billTypeKeys.icbc],
    },
    {
        id: 6,
        name: '6期',
        includes: [billTypeKeys.ccb, billTypeKeys.cmb, billTypeKeys.huabei, billTypeKeys.icbc],
    },
    {
        id: 12,
        name: '12期',
        includes: [billTypeKeys.ccb, billTypeKeys.cmb, billTypeKeys.huabei, billTypeKeys.icbc],
    },
    {
        id: 24,
        name: '24期',
        includes: [billTypeKeys.ccb, billTypeKeys.cmb, billTypeKeys.icbc],
    },
]

export const commonHeaders = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    referer: applePageUrl.buyiPhone,
    // cookie: document.cookie,
}

export const fetchHeaders = {
    ...commonHeaders,
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    Modelversion: 'v2',
    pragma: 'no-cache',
    syntax: 'graviton',
    // "x-aos-model-page": "checkoutPage",
    // "x-aos-stk": x_aos_stk,
    'X-Requested-With': 'Fetch',
}

export const defaultAres = {
    cityName: `上海`,
    provinceName: `上海`,
    districtName: `闵行区`,
}

export const CHECKOUT_STEPS = {
    selectStore: `?_a=select&_m=checkout.fulfillment.pickupTab.pickup.storeLocator`,
    selectPickupTime: `?_a=continueFromFulfillmentToPickupContact&_m=checkout.fulfillment`,
    checkoutFulfillment: `?_a=continueFromFulfillmentToPickupContact&_m=checkout.fulfillment`,
    pickupContact: `?_a=continueFromPickupContactToBilling&_m=checkout.pickupContact`,
    selectBill: `/billing?_a=selectBillingOptionAction&_m=checkout.billing.billingOptions`,
    checkoutBill: `/billing?_a=continueFromBillingToReview&_m=checkout.billing`,
    placeOrder: `?_a=continueFromReviewToProcess&_m=checkout.review.placeOrder`,
}

export const iframeMessagePass = {
    iframeID: 'tips_iframe',
    messageAction: 'updateFetchCount',
}
