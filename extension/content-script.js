// app/shared/util.ts
var sleep = async (sec) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, Number(sec) * 1000);
  });
};

// app/shared/constants.ts
var applePageUrl = {
  shoppingCart: `https://www.apple.com.cn/shop/bag`,
  buyiPhone: `https://www.apple.com.cn/shop/buy-iphone`
};

// app/scripts/content/doFroApplePages.ts
var doFroApplePages = async (url) => {
  await sleep(0.5);
  let queryString = location.search;
  let pathname = location.pathname;
  console.log(`doFroApplePages`, queryString);
  if (/\/shop\/sorry/i.test(pathname)) {
    location.href = applePageUrl.shoppingCart;
    return;
  }
};
var doFroApplePages_default = doFroApplePages;

// app/scripts/content/index.ts
console.log(`this is content`);
var contentRun = async () => {
  await doFroApplePages_default();
  let pushState = history.pushState;
  history.pushState = async function(...args) {
    const state = args[0];
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state });
    }
    console.log(`arguments`, args);
    let url = args[2] || "";
    url = url && url.search(/^http/) > -1 ? url : "";
    let pushResult = pushState.apply(history, args);
    console.log(`history`, history.length, location.href);
    await doFroApplePages_default(url);
    return pushResult;
  };
};
contentRun();
