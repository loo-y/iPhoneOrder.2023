const Match_URL = ['apple.com.cn']

const mainPage = './dist/main.html'
const optionsPage = './dist/options.html'

chrome.action.onClicked.addListener(async tab => {
    if (!tab.url) return
    const url = new URL(tab.url)
    const tabId = tab.id
    const isInMatchUrl = Match_URL.some(function (matchurl) {
        return url.origin.includes(matchurl)
    })
    const merge_request_iid = url.pathname?.match(/merge_requests\/(\d+)/)?.[1]
    if (isInMatchUrl && merge_request_iid) {
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
                    args: [{ command, merge_request_iid, tabUrl: url.href }],
                    func: (...args) => {
                        injectScript(...args)
                    },
                })
            }
        )
    }
})
