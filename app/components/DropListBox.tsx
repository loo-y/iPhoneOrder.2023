'use client'
import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { find as _find } from 'lodash'

type DropItem = {
    id: number | string
    name: string
    icon?: string
} & Record<string, any>

interface IDropListBoxProps {
    domID?: string
    title?: string
    itemList: Array<DropItem>
    selectedIndex?: number

    callback?: (item: DropItem) => void
}
export default function DropListBox({ domID, title, itemList, selectedIndex, callback }: IDropListBoxProps) {
    const [selected, setSelected] = useState(itemList[selectedIndex || 0])

    const handleSelect = (item: DropItem) => {
        setSelected(item)
        if (callback) callback(item)
    }

    // useEffect(() => {
    //     let newItem: DropItem
    //     if (selectedIndex !== undefined) {
    //         newItem = itemList[selectedIndex]
    //     } else {
    //         newItem = itemList[0]
    //     }
    //     setSelected(newItem)
    //     if (callback) callback(newItem)
    // }, [itemList, selectedIndex])

    // useEffect(() => {
    //     console.log(`selectedIndex`, selectedIndex)
    //     // 当之前的selected对象在新的itemList中存在时，不做处理
    //     if(!_find(itemList, _item=>{
    //         return _item.id == selected.id && _item.name == selected.name
    //     })){
    //         let newItem: DropItem
    //         if (selectedIndex !== undefined && itemList[selectedIndex]) {
    //             newItem = itemList[selectedIndex]
    //         }else{
    //             newItem = itemList[0]
    //         }
    //         setSelected(newItem)
    //         if (callback) callback(newItem)
    //     }
    // }, [itemList])

    useEffect(() => {
        if (selectedIndex && itemList[selectedIndex]) {
            setSelected(itemList[selectedIndex])
        }
    }, [selectedIndex])

    useEffect(() => {
        // 表示itemList已经变更
        if (
            !_find(itemList, _item => {
                return _item.id == selected.id && _item.name == selected.name
            })
        ) {
            let newItem: DropItem = (selectedIndex !== undefined ? itemList[selectedIndex] : itemList[0]) || itemList[0]
            setSelected(newItem)
        }
    }, [itemList])

    return (
        <Listbox value={selected} onChange={handleSelect}>
            {({ open }) => (
                <>
                    {title ? (
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            {title}
                        </Listbox.Label>
                    ) : null}
                    <div className="relative mt-2">
                        <Listbox.Button
                            id={domID || ''}
                            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        >
                            <span className="flex items-start">
                                {selected?.icon ? (
                                    <img src={selected.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                ) : null}
                                <span className=" block truncate h-6">{selected.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {itemList.map(item => (
                                    <Listbox.Option
                                        key={item.id}
                                        className={({ active }) =>
                                            `${
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                            } relative cursor-default select-none py-2 pl-3 pr-9`
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {item.icon ? (
                                                        <img
                                                            src={item.icon}
                                                            alt=""
                                                            className="h-5 w-5 flex-shrink-0 rounded-full"
                                                        />
                                                    ) : null}
                                                    <span
                                                        className={`${
                                                            selected ? 'font-semibold' : 'font-normal'
                                                        } 'ml-3 block truncate`}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={`${
                                                            active ? 'text-white' : 'text-indigo-600'
                                                        } absolute inset-y-0 right-0 flex items-center pr-4`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
