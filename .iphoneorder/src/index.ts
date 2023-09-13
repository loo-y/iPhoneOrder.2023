import 'core-js/stable'
import iPhoneMonkey from './iPhoneMonkey'

const iPhoneOrder = (config?: AnyObj) => {
    // 劫持window.history
    iPhoneMonkey(window.history, config)
}

window.iPhoneOrder = iPhoneOrder
export default iPhoneOrder
