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
const prefixBillingoptions = `${prefixBill}.billingoptions`

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
    stepWait: 1000,
    payBill: billTypeKeys.alipay,
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
