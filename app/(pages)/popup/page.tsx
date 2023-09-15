'use client'
import { restoreFromStorage, saveToStorage } from '@/app/shared/util'
import { storeKeys } from '@/app/shared/constants'
import { useEffect, useState } from 'react'
import { Match_URL } from '@/app/shared/constants'

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
        window.close()
    }
    return (
        <div className="mx-auto my-2 w-[22rem] h-[17rem]">
            <main className="flex w-fit flex-col items-center gap-8 justify-between py-3 px-2 mx-auto mb-2 mt-5">
                <div className="flex flex-col gap-3  justify-between mb-2">
                    <SelectItem
                        enabled={orderEnabled}
                        index={0}
                        callback={({ enabled }) => {
                            setOrderEnable(enabled)
                        }}
                    />
                </div>
                <div className="w-full flex flex-col justify-center text-center items-center gap-3">
                    <div
                        className={`flex w-full h-10 ${'bg-lime-600 cursor-pointer'} bg-opacity-90 rounded-lg my-2 items-center align-middle justify-center text-center min-w-min px-3 hover:shadow-md`}
                        onClick={handleConfirm}
                    >
                        确认
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Popup

interface ISelectItemProps {
    enabled?: boolean
    index: number
    callback: ({ enabled }: { enabled: boolean }) => void
}
const SelectItem = ({ enabled, callback }: ISelectItemProps) => {
    const handleToggle = () => {
        callback({
            enabled: !enabled,
        })
    }
    return (
        <div className="flex h-14 flex-row gap-6">
            <div className="w-20 flex-col justify-end items-end gap-1.5 inline-flex">
                {enabled ? (
                    <div
                        className="w-14 h-7 bg-lime-600 bg-opacity-70 rounded-2xl  py-0.5 px-[0.2rem] flex relative cursor-pointer ease-linear duration-500 shadow-lime-500/50 shadow-md"
                        onClick={handleToggle}
                    >
                        <div className="w-6 h-6 bg-gray-100 rounded-full pt-1 pb-1.5 px-1 ease-linear duration-300 ml-[1.65rem]"></div>
                    </div>
                ) : (
                    <div
                        className="w-14 h-7 bg-slate-400 bg-opacity-50 rounded-2xl py-0.5 px-[0.2rem] flex relative cursor-pointer ease-linear duration-500 shadow-slate-500/50 shadow-md"
                        onClick={handleToggle}
                    >
                        <div className="w-6 h-6 bg-gray-100 rounded-full pt-1 pb-1.5  px-1 ease-linear duration-300 ml-0"></div>
                    </div>
                )}
            </div>
        </div>
    )
}

interface ICondirmLoadProps {
    callback?: (msg: string) => void
}
const confirmLoad = async ({ callback }: ICondirmLoadProps) => {
    let msg = ``
    if (typeof chrome === 'undefined' || !chrome?.tabs) {
        msg = 'Please use as chrome extension'
        callback && callback(msg)
        return
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabUrl = (tab?.url || '').toLowerCase()
    const urlObj = new URL(tabUrl)
    const isInMatchUrl = urlObj.href.includes(Match_URL)

    if (isInMatchUrl) {
        chrome.tabs.reload(tab.id)
        return
    }
}
