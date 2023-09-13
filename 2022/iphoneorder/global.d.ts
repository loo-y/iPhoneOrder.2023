// interface InputElement extends HTMLInputElement {
//     _valueTracker: any
// }

type AnyObj = { [index: string]: any }

interface Window {
    iPhoneOrderConfig: any
    iPhoneOrder: any
}

interface History {
    onpushstate: any
}
interface HTMLInputElement {
    _valueTracker: any
}

interface Event {
    simulated?: boolean
}

type IPHONEORDERCONFIG = {
    lastName?: string
    firstName?: string
    mobile?: string | number
    last4code?: string | number
    appleId?: string
    password?: string
    stepWait: number
    payBill: string
    payInstallment?: number
    provinceName?: string
    cityName?: string
    districtName?: string
    employeeId?: string
}

// ********** ⬇️ TamperMonkey declare ⬇️ **********
type GMXMLResponse = {
    responseText: string
}
type GMRequestProps = {
    onload: (response: GMXMLResponse) => void
    onerror: (response: GMXMLResponse) => void
} & AnyObj

declare function GM_xmlhttpRequest(props: GMRequestProps): any
// ********** ⬆️ TamperMonkey declare ⬆️ **********
