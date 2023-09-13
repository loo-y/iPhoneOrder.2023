// iPhone 各型号
const iPhone_PartNumber_Types = {
    pro: [
        'MQ1C3CH/A', // iPhone 14 Pro 256GB 暗紫色
        'MQ143CH/A', // iPhone 14 Pro 256GB 金色
        'MQ0W3CH/A', // iPhone 14 Pro 256GB 银色
        'MQ0M3CH/A', // iPhone 14 Pro 256GB 深空黑色

        'MQ263CH/A', // iPhone 14 Pro 512GB 暗紫色
        'MQ1J3CH/A', // iPhone 14 Pro 512GB 深空黑色
        'MQ203CH/A', // iPhone 14 Pro 512GB 金色
        'MQ1R3CH/A', // iPhone 14 Pro 512GB 银色
    ],
    proMax: [
        'MQ8A3CH/A', // iPhone 14 Pro Max 256GB 暗紫色
        'MQ893CH/A', // iPhone 14 Pro Max 256GB 金色
        'MQ883CH/A', // iPhone 14 Pro Max 256GB 银色
        'MQ873CH/A', // iPhone 14 Pro Max 256GB 深空黑色

        'MQ8G3CH/A', // iPhone 14 Pro Max 512GB 暗紫色
        'MQ8D3CH/A', // iPhone 14 Pro Max 512GB 深空黑色
        'MQ8F3CH/A', // iPhone 14 Pro Max 512GB 金色
        'MQ8E3CH/A', // iPhone 14 Pro Max 512GB 银色
    ],
}

// 重试次数超过之后重新刷新页面
const afterCountThenReload = 50

// 付款方式
const BILL_OPTIONS_TYPE: AnyObj = {
    alipay: `支付宝`,
    wechat: `微信`,
    ccb: `建设银行`,
    cmb: `招商银行`,
    icbc: `工商银行`,
    huabei: `花呗`,
}

const CHECKOUT_STEPS = {
    selectStore: `_a=select&_m=checkout.fulfillment.pickupTab.pickup.storeLocator`,
    selectPickupTime: `_a=continue&_m=checkout.fulfillment`,
    pickupContact: `_a=continue&_m=checkout.pickupContact`,
    selectBill: `_a=selectBillingOptionAction&_m=checkout.billing.billingOptions`,
    checkoutBill: `_a=continue&_m=checkout.billing`,
    placeOrder: `_a=continue&_m=checkout.review.placeOrder`,
}

const defaultAres = {
    cityName: `上海`,
    provinceName: `上海`,
    districtName: `闵行区`,
}

const applePageUrl = {
    shoppingCart: `https://www.apple.com.cn/shop/bag`,
    buyiPhone: `https://www.apple.com.cn/shop/buy-iphone`,
}

const prefixCheckout = `checkout`
const prefixPickupContact = `${prefixCheckout}.pickupContact`
const prefixSelfPickupContact = `${prefixPickupContact}.selfPickupContact`
const prefixSelfContact = `${prefixSelfPickupContact}.selfContact`
const prefixAddressCheckout = `${prefixSelfContact}.address`

const prefixNationalIdSelf = `${prefixSelfPickupContact}.nationalIdSelf`

const prefixBill = `${prefixCheckout}.billing`
const prefixBillingoptions = `${prefixBill}.billingoptions`

const pageElementsId = {
    shoppingCart: {
        checkoutButton: `shoppingCart.actions.navCheckout`,
    },
    signIn: {
        appleIdInput: `signIn.customerLogin.appleId`,
        applePasswordInput: `signIn.customerLogin.password`,
        loginSubmitButton: `signin-submit-button`,
        guestLoginButon: `signIn.guestLogin.guestLogin`,
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

const commonHeaders = {
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
}

const fetchHeaders = {
    ...commonHeaders,
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded',
    modelversion: 'v2',
    pragma: 'no-cache',
    syntax: 'graviton',
    // "x-aos-model-page": "checkoutPage",
    // "x-aos-stk": x_aos_stk,
    'x-requested-with': 'Fetch',
}

export {
    defaultAres,
    CHECKOUT_STEPS,
    BILL_OPTIONS_TYPE,
    iPhone_PartNumber_Types,
    afterCountThenReload,
    applePageUrl,
    pageElementsId,
    commonHeaders,
    fetchHeaders,
}
