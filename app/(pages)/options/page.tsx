'use client'
import { restoreFromStorage, saveToStorage } from '@/app/shared/util'
import {
    storeKeys,
    billItemList,
    defaultiPhoneOrderConfig,
    billTypeKeys,
    defaultPayinstallmentTotal,
} from '@/app/shared/constants'
import DropListBox from '@/app/components/DropListBox'
import { IPHONEORDER_CONFIG } from '@/app/shared/interface'
import { useCallback, useEffect, useState } from 'react'
import { filter as _filter, map as _map, find as _find } from 'lodash'
import city from '@/app/shared/location/city.json'
import province from '@/app/shared/location/province.json'
import county from '@/app/shared/location/county.json'

const defaultItem = { id: '', name: '' }
export default function Options() {
    const [config, setConfig] = useState<IPHONEORDER_CONFIG>(defaultiPhoneOrderConfig)
    const [payinstallmentList, setpayinstallmentList] = useState([defaultItem])
    const [cityList, setCityList] = useState([defaultItem])
    const [districtList, setDistrictList] = useState([defaultItem])
    useEffect(() => {
        restoreFromStorage(storeKeys.orderConfig).then(data => {
            if (data) {
                setConfig(data as IPHONEORDER_CONFIG)
            }
        })
    }, [])

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
    }, [config.payBill])

    useEffect(() => {
        if (config.provinceName) {
            const provinceId: string =
                _find(province, item => {
                    return item.name == config.provinceName
                })?.id || ''
            if (provinceId) {
                // @ts-ignore
                const newCityList = city[provinceId]
                setCityList(newCityList)
            }
        }
    }, [config.provinceName])

    useEffect(() => {
        if (config.cityName) {
            const cityId: string =
                _find(cityList, item => {
                    return item.name == config.cityName
                })?.id || ''
            if (cityId) {
                // @ts-ignore
                const newDistrictList = county[cityId]
                setDistrictList(newDistrictList)
            }
        }
    }, [config.cityName])

    // ************ 👆下拉菜单联动👆 ************

    const handleSelectPayType = (payItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                payBill: payItem.id,
            }
        })
    }

    const handleSelectProvince = (payItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                provinceName: payItem.name,
            }
        })
    }

    const handleSelectCity = (payItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                cityName: payItem.name,
            }
        })
    }

    const handleSelectDistrict = (payItem: Record<string, any>) => {
        setConfig(prev => {
            return {
                ...prev,
                districtName: payItem.name,
            }
        })
    }

    const handleSave = useCallback(() => {
        console.log(config)
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
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className={labelClass}>
                                名字
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="mobile-number" className={labelClass}>
                                手机号
                            </label>
                            <div className="mt-2">
                                <input type="tel" name="mobile-number" id="mobile-number" className={inputClass} />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-code" className={labelClass}>
                                身份后四位
                            </label>
                            <div className="mt-2">
                                <input type="text" name="last-code" id="last-code" className={inputClass} />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="email" className={labelClass}>
                                邮箱/Apple ID
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="password" className={labelClass}>
                                登录密码
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    className={inputClass}
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
                                    callback={handleSelectPayType}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="pay-installment" className={labelClass}>
                                分期笔数
                            </label>
                            <div className="mt-2">
                                <DropListBox itemList={payinstallmentList} domID={'pay-installment'} />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="province-list" className={labelClass}>
                                省份
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={province}
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
                                <DropListBox itemList={cityList} domID={'city-list'} callback={handleSelectCity} />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="district-list" className={labelClass}>
                                区名
                            </label>
                            <div className="mt-2">
                                <DropListBox
                                    itemList={districtList}
                                    domID={'district-list'}
                                    callback={handleSelectDistrict}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="country" className={labelClass}>
                                Country
                            </label>
                            <div className="mt-2">
                                <select id="country" name="country" autoComplete="country-name" className={inputClass}>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="street-address" className={labelClass}>
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
                                    autoComplete="street-address"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="city" className={labelClass}>
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    autoComplete="address-level2"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="region" className={labelClass}>
                                State / Province
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="region"
                                    id="region"
                                    autoComplete="address-level1"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="postal-code" className={labelClass}>
                                ZIP / Postal code
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="postal-code"
                                    id="postal-code"
                                    autoComplete="postal-code"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
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
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                            Candidates
                                        </label>
                                        <p className="text-gray-500">
                                            Get notified when a candidate applies for a job.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                            Offers
                                        </label>
                                        <p className="text-gray-500">
                                            Get notified when a candidate accepts or rejects an offer.
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
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-email"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-email" className={labelClass}>
                                        Same as email
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-nothing"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-nothing" className={labelClass}>
                                        No push notifications
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
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
