'use client'
import { restoreFromStorage, saveToStorage } from '@/app/shared/util'
import { defaultiPhoneOrderConfig, storeKeys } from '@/app/shared/constants'
import { useEffect, useState } from 'react'
import { Match_URL } from '@/app/shared/constants'
import { IPHONEORDER_CONFIG } from '@/app/shared/interface'

const Popup = () => {
    const [orderEnabled, setOrderEnable] = useState<boolean>(false)
    const [config, setConfig] = useState<IPHONEORDER_CONFIG>(defaultiPhoneOrderConfig)
    // 异步获取enable状态
    useEffect(() => {
        const getOrderEnable = async () => {
            const isEnabled = await restoreFromStorage(storeKeys.orderEnabled)
            const config = await restoreFromStorage(storeKeys.orderConfig)
            setOrderEnable(!!isEnabled)
            setConfig(config as IPHONEORDER_CONFIG)
        }
        getOrderEnable()
    }, [])

    const handleOptionClick = () => {
        if (typeof chrome !== 'undefined' && chrome?.runtime) {
            chrome.runtime.openOptionsPage()
        } else {
            console.log(`please open in chrome`)
        }
    }
    const handleConfirm = () => {
        if (
            !orderEnabled ||
            (config?.lastName &&
                config?.mobile &&
                config?.firstName &&
                config?.appleId &&
                config?.last4code &&
                config?.cityName &&
                config?.districtName &&
                config?.provinceName)
        ) {
            confirmAsync(orderEnabled)
        } else {
            setOrderEnable(false)
            alert(`请先配置必要信息`)
        }
    }
    const handlePlayAudio = () => {
        const audio = new Audio('http://cos.rayjason.cn/audio/beep.mp3');
        audio.play().then(() => {
            console.log('Audio played successfully');
        }).catch(error => {
            console.error('Audio playback failed:', error);
        });
    }
    return (
        <div className="mx-auto my-2 w-80 h-40">
            <main className="flex w-fit flex-col items-center gap-8 justify-between py-3 px-2 mx-auto mb-2 mt-5">
                <div className="flex flex-row gap-3 h-10 justify-between mb-2 px-4 py-6 rounded-xl bg-slate-100">
                    <div className="flex text-gray-600 items-center text-base font-bold">开启自动抢购</div>
                    <SelectItem
                        enabled={orderEnabled}
                        index={0}
                        callback={({ enabled }) => {
                            setOrderEnable(enabled)
                        }}
                    />
                </div>
            </main>
            <div className="w-full flex flex-row justify-center text-center items-center gap-4 text-sm p-4">
                <button
                    className={`flex w-1/4 h-9 bg-white text-indigo-500 cursor-pointer bg-opacity-90 border-4 border-t-2 border-indigo-500 rounded-3xl my-2 items-center align-middle justify-center text-center min-w-min px-3 hover:shadow-md hover:border-t-[3px] hover:border-b-[3px]`}
                    onClick={handleOptionClick}
                >
                    配置
                </button>
                <button
                    className={`flex w-1/4 h-9 ${'bg-indigo-600 cursor-pointer'} bg-opacity-90 border border-indigo-500 rounded-3xl my-2 items-center align-middle justify-center text-center min-w-min px-3 hover:shadow-md hover:bg-indigo-500`}
                    onClick={handleConfirm}
                >
                    确认
                </button>
                <button
                    className={`flex w-1/4 h-9 ${'bg-indigo-600 cursor-pointer'} bg-opacity-90 border border-indigo-500 rounded-3xl my-2 items-center align-middle justify-center text-center min-w-min px-3 hover:shadow-md hover:bg-indigo-500`}
                    onClick={handlePlayAudio}
                >
                    试听
                </button>
            </div>
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
        <div className="flex flex-row gap-6">
            <div className="w-20 flex-col justify-center items-end gap-1.5 inline-flex">
                {enabled ? (
                    <div
                        className="w-14 h-7 bg-indigo-600  bg-opacity-70 rounded-2xl  py-0.5 px-[0.2rem] flex relative cursor-pointer ease-linear duration-500 shadow-indigo-500/50 shadow-md"
                        onClick={handleToggle}
                    >
                        <div className="w-6 h-6 bg-gray-100 rounded-full pt-1 pb-2 px-1 ease-linear duration-300 ml-[1.65rem]"></div>
                    </div>
                ) : (
                    <div
                        className="w-14 h-7 bg-slate-400 bg-opacity-50 rounded-2xl py-0.5 px-[0.2rem] flex relative cursor-pointer ease-linear duration-500 shadow-slate-500/50 shadow-md"
                        onClick={handleToggle}
                    >
                        <div className="w-6 h-6 bg-gray-100 rounded-full pt-1 pb-2  px-1 ease-linear duration-300 ml-0"></div>
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

const confirmAsync = async (orderEnabled: boolean) => {
    await saveToStorage(orderEnabled, storeKeys.orderEnabled)
    window.close()
}
