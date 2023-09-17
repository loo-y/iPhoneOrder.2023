'use client'
import { useEffect, useState } from 'react'
import { iframeMessagePass } from '@/app/shared/constants'

const Tips = () => {
    const [fetchCount, setFetchCount] = useState(0)
    const [beforeReload, setBeforeReload] = useState(50)
    useEffect(() => {
        window.addEventListener('message', function (event) {
            if (event.data.action === iframeMessagePass.messageAction) {
                setFetchCount(event.data.count)
                setBeforeReload(event.data.beforeReload)
            }
        })
    }, [])

    // if(!fetchCount) return <div></div>
    // flex w-52 h-fit flex-col  text-gray-700 items-center gap-1 px-2  justify-between py-2 mx-auto rounded-xl bg-slate-100 hover:bg-slate-200 text-base font-bold cursor-move shadow-orange-200  shadow-md
    return (
        <main className="flex w-52 h-fit flex-col  text-gray-700 items-center gap-1 px-2  justify-between py-2 mx-auto rounded-lg bg-slate-100 text-base font-bold cursor-pointer shadow-slate-500/50  shadow-lg">
            <div className="flex flex-row gap-0 h-8 items-center justify-center py-2 ">
                <div className="  ">
                    当前正在重试：
                    <span className=" text-indigo-700">{fetchCount > 9 ? fetchCount : '0' + fetchCount}</span>次
                </div>
            </div>
            <div className="flex flex-row h-8">
                <span className="text-indigo-700">{beforeReload}</span>次之后将刷新页面
            </div>
        </main>
    )
}

export default Tips
