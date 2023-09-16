'use client'
import { restoreFromStorage, saveToStorage, sleep } from '@/app/shared/util'
import {
    storeKeys,
    billItemList,
    defaultiPhoneOrderConfig,
    billTypeKeys,
    defaultPayinstallmentTotal,
} from '@/app/shared/constants'
import DropListBox from '@/app/components/DropListBox'
import { IPHONEORDER_CONFIG } from '@/app/shared/interface'
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { filter as _filter, map as _map, find as _find, findIndex as _findIndex } from 'lodash'
import city from '@/app/shared/location/city.json'
import province from '@/app/shared/location/province.json'
import county from '@/app/shared/location/county.json'

const defaultItem = { id: '', name: '' }
export default function Options() {
    const [config, setConfig] = useState<IPHONEORDER_CONFIG>(defaultiPhoneOrderConfig)
    const [payinstallmentList, setpayinstallmentList] = useState([defaultItem])
    const [provinceList, setProvinceList] = useState(province)
    const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(0)
    const [cityList, setCityList] = useState([defaultItem])
    const [selectedCityIndex, setSelectedCityIndex] = useState(0)
    const [districtList, setDistrictList] = useState([defaultItem])
    const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const last4codeRef = useRef<HTMLInputElement>(null)
    const mobileRef = useRef<HTMLInputElement>(null)
    const appleidRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const stepWaitRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        restoreFromStorage(storeKeys.orderConfig).then(data => {
            if (data) {
                console.log(`restoreFromStorage`, data)
                setConfig(config => {
                    return {
                        ...config,
                        ...(data as IPHONEORDER_CONFIG),
                    }
                })
            }
        })
    }, [])

    // ************ 更新选中支付方式 ************
    const billSelected = useMemo(() => {
        return (
            (config?.payBill &&
                _findIndex(billItemList, _b => {
                    return _b.id == config.payBill
                })) ||
            0
        )
    }, [config.payBill])

    // ************ 更新选中分期笔数 ************
    const payinstallmentSelected = useMemo(() => {
        return (
            (config?.payInstallment &&
                _findIndex(payinstallmentList, _b => {
                    return _b.id == String(config.payInstallment)
                })) ||
            0
        )
    }, [config.payInstallment])

    // ************ 👇下拉菜单联动👇 ************
    useEffect(() => {
        const newPayinstallmentList = _map(
            _filter(defaultPayinstallmentTotal, item => {
                if (item.id == 0) return true
                if (item?.includes && Number(item?.includes?.length) > 0) {
                    return item.includes.includes(config.payBill)
                }
                return false
            }),
            (_item: any) => {
                return {
                    id: _item.id,
                    name: _item.name,
                }
            }
        )

        setpayinstallmentList(newPayinstallmentList)
        // 当原来的分期笔数不存在时
        if (
            !_find(newPayinstallmentList, _t => {
                return _t.id == config.payInstallment
            })
        ) {
            setConfig({
                ...config,
                payInstallment: Number(newPayinstallmentList[0].id) || 0,
            })
        }
    }, [config.payBill])

    useEffect(() => {
        if (config.provinceName) {
            let provinceIndex: number = _findIndex(province, item => {
                return item.name == config.provinceName
            })
            provinceIndex = provinceIndex > -1 ? provinceIndex : 0

            setSelectedProvinceIndex(provinceIndex)
            const provinceId = province[provinceIndex].id
            // @ts-ignore
            const newCityList = city[provinceId]
            setCityList(newCityList)
            if (
                !_find(newCityList, _t => {
                    return _t.name == config.cityName
                })
            ) {
                setConfig({
                    ...config,
                    cityName: newCityList[0].name,
                })
            }
            // if (provinceList.length < 1) {
            //     setProvinceList(province)
            // }
        }
    }, [config.provinceName])

    useEffect(() => {
        if (config.cityName) {
            let cityIndex: number = _findIndex(cityList, item => {
                return item.name == config.cityName
            })
            cityIndex = cityIndex > -1 ? cityIndex : 0
            setSelectedCityIndex(cityIndex)
            const cityId: string = cityList[cityIndex].id
            // @ts-ignore
            const newDistrictList = county[cityId]
            // @ts-ignore
            console.log(`cityIndex`, cityIndex, cityList[cityIndex], county[cityId])
            if (newDistrictList) {
                setDistrictList(newDistrictList)
                if (
                    !_find(newDistrictList, _t => {
                        return _t.name == config.districtName
                    })
                ) {
                    setConfig({
                        ...config,
                        districtName: newDistrictList[0].name,
                    })
                }
            }
        }
    }, [config.cityName, cityList])

    useEffect(() => {
        // setSelectedDistrictIndex
        let districtIndex: number = _findIndex(districtList, item => {
            return item.name == config.districtName
        })
        districtIndex = districtIndex > -1 ? districtIndex : 0
        setSelectedDistrictIndex(districtIndex)
    }, [config.districtName, districtList])
    // ************ 👆下拉菜单联动👆 ************

    // ************ 支付方式 ************
    const handleSelectPayType = (payItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                payBill: payItem.id,
            }
        })
    }

    // ************ 分期笔数 ************
    const handleSelectPayinstallment = (payinstallmentItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                payInstallment: payinstallmentItem.id,
            }
        })
    }

    // ************ 选中省份 ************
    const handleSelectProvince = (provinceItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                provinceName: provinceItem.name,
            }
        })
    }
    // ************ 选中城市 ************
    const handleSelectCity = (cityItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                cityName: cityItem.name,
            }
        })
    }

    // ************ 选中区域 ************
    const handleSelectDistrict = (districtItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                districtName: districtItem.name,
            }
        })
    }

    const handleSave = useCallback(() => {
        const saveConfig: IPHONEORDER_CONFIG = {
            ...config,
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
            last4code: last4codeRef.current?.value,
            mobile: mobileRef.current?.value,
            appleId: appleidRef.current?.value,
            password: passwordRef.current?.value,
            stepWait: Number(stepWaitRef.current?.value) || config.stepWait || 10,
        }
        console.log(saveConfig)
        saveAsync(saveConfig)
    }, [config])

    const handleCancel = useCallback(() => {
        window.close()
    }, [])

    const inputClass = `px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`
    const labelClass = `block text-sm font-medium leading-6 text-gray-900`
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">配置信息</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">以下信息用于抢购iPhone时自动填入</p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className={labelClass}>
                                姓氏
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={lastNameRef}
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className={inputClass}
                                    defaultValue={config.lastName}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className={labelClass}>
                                名字
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={firstNameRef}
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className={inputClass}
                                    defaultValue={config.firstName}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="mobile-number" className={labelClass}>
                                手机号
                            </label>
                            <div className="mt-2">
                                <input
                                    type="tel"
                                    ref={mobileRef}
                                    name="mobile-number"
                                    id="mobile-number"
                                    className={inputClass}
                                    defaultValue={config.mobile}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-code" className={labelClass}>
                                身份后四位
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    ref={last4codeRef}
                                    name="last-code"
                                    id="last-code"
                                    className={inputClass}
                                    defaultValue={config.last4code}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="email" className={labelClass}>
                                邮箱/Apple ID
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={appleidRef}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={inputClass}
                                    defaultValue={config.appleId}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="password" className={labelClass}>
                                登录密码
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    className={inputClass}
                                    defaultValue={config.password}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="pay-type" className={labelClass}>
                                支付方式
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={billItemList}
                                    domID={'pay-type'}
                                    selectedIndex={billSelected}
                                    callback={handleSelectPayType}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="pay-installment" className={labelClass}>
                                分期笔数
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={payinstallmentList}
                                    domID={'pay-installment'}
                                    selectedIndex={payinstallmentSelected}
                                    callback={handleSelectPayinstallment}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="province-list" className={labelClass}>
                                省份
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={provinceList}
                                    selectedIndex={selectedProvinceIndex}
                                    domID={'province-list'}
                                    callback={handleSelectProvince}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="city-list" className={labelClass}>
                                城市
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={cityList}
                                    domID={'city-list'}
                                    callback={handleSelectCity}
                                    selectedIndex={selectedCityIndex}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="district-list" className={labelClass}>
                                区名
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={districtList}
                                    selectedIndex={selectedDistrictIndex}
                                    domID={'district-list'}
                                    callback={handleSelectDistrict}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">系统设置</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600"></p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="step-wait" className={labelClass}>
                                StepWait (步频等待秒数。默认10秒，不建议设置过短，会封IP)
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={stepWaitRef}
                                    id={'step-wait'}
                                    min={1}
                                    max={20}
                                    step={0.5}
                                    type="number"
                                    defaultValue={config.stepWait}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600"></p>

                    <div className="mt-10 space-y-10">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
                            <div className="mt-6 space-y-6">
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                            Comments
                                        </label>
                                        <p className="text-gray-500">
                                            Get notified when someones posts a comment on a posting.
                                        </p>
                                    </div>
                                </div>
                                
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                Push Notifications
                            </legend>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                These are delivered via SMS to your mobile phone.
                            </p>
                            <div className="mt-6 space-y-6">
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-everything"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-everything" className={labelClass}>
                                        Everything
                                    </label>
                                </div>
                                
                            </div>
                        </fieldset>
                    </div>
                </div> */}
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCancel}>
                    取消
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleSave}
                >
                    保存
                </button>
            </div>
        </main>
    )
}

const saveAsync = async (config: IPHONEORDER_CONFIG) => {
    await saveToStorage(config, storeKeys.orderConfig)
    await sleep(1)
    // window.close()
}
