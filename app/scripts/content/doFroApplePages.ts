import { sleep } from "@/app/shared/util"
import { applePageUrl } from "@/app/shared/constants"

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
}

export default doFroApplePages