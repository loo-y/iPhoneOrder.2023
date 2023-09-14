export const sleep = async (sec: number | string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, Number(sec) * 1000)
    })
}