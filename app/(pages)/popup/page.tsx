'use client'
import { restoreFromStorage, saveToStorage } from '@/app/shared/util'
import { storeKeys } from '@/app/shared/constants'
import { useEffect, useState } from 'react'

const Popup = () => {
    const [orderEnabled, setOrderEnable] = useState<boolean>(false)

    // 异步获取enable状态
    useEffect(() => {
        const getOrderEnable = async () => {
            const isEnabled = await restoreFromStorage(storeKeys.orderEnabled)
            setOrderEnable(!!isEnabled)
        }
        getOrderEnable()
    }, [])

    const handleConfirm = () => {
        saveToStorage(orderEnabled, storeKeys.orderEnabled)
    }
    return <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
}

export default Popup
