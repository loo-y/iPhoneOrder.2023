export interface IPHONEORDER_CONFIG {
    lastName?: string
    firstName?: string
    mobile?: string | number
    last4code?: string | number
    appleId?: string
    password?: string
    stepWait: number
    payBill: 'alipay' | 'wechat' | 'ccb' | 'cmb' | 'icbc' | 'huabei'
    payInstallment?: number
    provinceName?: string
    cityName?: string
    districtName?: string
    employeeId?: string
    afterCountThenReload: number
}
