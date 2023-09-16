const Match_URL = ['apple.com.cn']

const mainPage = './dist/main.html'
const optionsPage = './dist/options.html'

chrome.action.onClicked.addListener(async tab => {
    console.log(`chrome action onClicked`)
    if (!tab.url) return
    const url = new URL(tab.url)
    const tabId = tab.id
    const isInMatchUrl = Match_URL.some(function (matchurl) {
        return url.origin.includes(matchurl)
    })

    if (isInMatchUrl) {
        // inject script in page first
        chrome.scripting.executeScript(
            {
                target: { tabId },
                world: 'MAIN',
                files: ['./inject-script.js'],
            },
            () => {
                const command = 'iphone_order'
                // after inject function in page window, then call it in page window
                chrome.scripting.executeScript({
                    target: { tabId },
                    world: 'MAIN',
                    args: [{ command, tabUrl: url.href }],
                    func: (...args) => {
                        injectScript(...args)
                    },
                })
            }
        )
    }
})
