const { exec } = require('child_process')
import path from 'path'

const removeFile = (filePath: string, isForce?: boolean) => {
    if (!filePath) return
    return new Promise((resolve, reject) => {
        const command = `rm ${isForce ? '-rf' : ''} ${filePath}`

        try {
            // @ts-ignore
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error removing file:', err)
                    resolve(false)
                } else {
                    console.log('File removed successfully', filePath)
                    resolve(true)
                }
            })
        } catch (e) {
            console.log('Error removing file catch:', e)
            resolve(false)
        }
    })
}

async function bunBuild() {
    const outDir = path.resolve(__dirname, './extension')
    const contentScript = path.resolve(__dirname, './app/scripts/content/')
    const builtContentScript = path.resolve(outDir, './content-script.js')

    const injectScript = path.resolve(__dirname, './app/scripts/inject/')
    const builtInjectScript = path.resolve(outDir, './inject-script.js')

    const zipFIle = path.resolve(__dirname, './iPhoneOrder.zip')

    // 临时移除 removeFile 调用， bun的bug。 TODO
    // await Promise.all([
    //     removeFile(builtContentScript, true),
    //     removeFile(builtInjectScript, true),
    //     removeFile(zipFIle, true),
    // ])

    // @ts-ignore
    await Bun.build({
        entrypoints: [contentScript, injectScript],
        target: 'browser',
        minify: true,
        outdir: outDir,
        naming: '[dir]-script.[ext]',
    })
}

bunBuild()
