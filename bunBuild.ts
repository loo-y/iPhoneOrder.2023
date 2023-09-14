import { rm } from "fs"
import path from "path"

async function bunBuild() {
    const outDir = path.resolve(__dirname, "./extension");
    const contentScript = path.resolve(__dirname, './app/scripts/content/')
    const builtContentScript = path.resolve(outDir, "./out/content-script.js");

    const injectScript = path.resolve(__dirname, './app/scripts/inject/')
    const builtInjectScript = path.resolve(outDir, "./out/inject-script.js");

    rm(builtContentScript, {force: true, recursive: true}, ()=>{})
    rm(builtInjectScript, {force: true, recursive: true}, ()=>{})

    // @ts-ignore
    await Bun.build({
        entrypoints: [contentScript, injectScript],
        target: 'browser', 
        minify: true,
        outdir: outDir,
        naming: "[dir]-script.[ext]"
    })
}

bunBuild()