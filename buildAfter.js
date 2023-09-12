const extensionNextConfig = require('./extension.next.config')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const cheerio = require('cheerio')

function getAllHtmlFiles(folderPath) {
    // 获取文件夹下所有文件和文件夹的名称
    const fileNames = fs.readdirSync(folderPath)
    // 过滤出所有 HTML 文件
    const htmlFiles = []
    _.map(fileNames, fileName => {
        const filePath = path.join(folderPath, fileName)
        const stats = fs.statSync(filePath)
        if (stats.isFile() && path.extname(filePath) === '.html') {
            htmlFiles.push({
                fileName: fileName.replace(/\.html$/, ''),
                filePath: filePath,
            })
        }
    })

    // 递归处理所有子文件夹
    const subFolders = fileNames.filter(fileName => {
        const filePath = path.join(folderPath, fileName)
        const stats = fs.statSync(filePath)
        return stats.isDirectory()
    })

    _.each(subFolders, subFolder => {
        const subFolderPath = path.join(folderPath, subFolder)
        const subFolderHtmlFiles = getAllHtmlFiles(subFolderPath)
        htmlFiles.push(...subFolderHtmlFiles)
    })

    return htmlFiles
}

function extractInlineScripts(htmlFilePath, outputFilePath) {
    // 读取 HTML 文件内容
    const html = fs.readFileSync(htmlFilePath, 'utf-8')

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(html)

    // 获取所有的 inline script 标签
    const inlineScripts = $('script').filter(function () {
        return !$(this).attr('src')
    })

    // 提取 inline script 的内容并拼接到一起
    const inlineScriptContent = inlineScripts
        .map(function () {
            return $(this).html()
        })
        .get()
        .join('\n\n')

    // 移除所有的 inline script 标签
    inlineScripts.remove()

    // 将 inline script 内容写入到指定的文件中
    fs.writeFileSync(outputFilePath, inlineScriptContent)

    // 将拼接后的 JS 文件引入到 HTML 中
    const jsFileName = path.basename(outputFilePath)
    $('body').append(`<script src="${jsFileName}"></script>`)

    // 将修改后的 HTML 内容写回到原文件中
    fs.writeFileSync(htmlFilePath, $.html())
}

const buildAfter = () => {
    // get build path
    const distDir = extensionNextConfig.distDir
    const htmlFiles = getAllHtmlFiles(distDir)
    if (_.isEmpty(htmlFiles)) return

    _.map(htmlFiles, htmlFile => {
        const { fileName, filePath } = htmlFile
        const outputFilePath = path.join(filePath, '../', `${fileName}.js`)
        extractInlineScripts(filePath, outputFilePath)
    })
}

buildAfter()