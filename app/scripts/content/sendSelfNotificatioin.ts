import { sleep } from '../../shared/util'

const sendSelfNotificatioin = async ({ url }: { url?: string }) => {
    if (!url) return

    return Promise.race([
        sleep(5),
        new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.style.display = 'none'
            img.style.width = '1px'
            img.style.height = '1px'
            document.body.appendChild(img)
            img.addEventListener('load', function () {
                console.log('请求成功')
                resolve(true)
            })
            img.addEventListener('error', function () {
                console.log('请求失败')
                resolve(false)
            })
        }),
    ])
}

export default sendSelfNotificatioin
