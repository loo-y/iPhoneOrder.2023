// app/shared/constants.ts
var iPhoneModels = {
  iPhone15Pro: [
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "128GB", model: "MTQ43CH/A" },
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MTQ83CH/A" },
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MTQD3CH/A" },
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MTQH3CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "128GB", model: "MTQ53CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MTQ93CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MTQE3CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MTQJ3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "128GB", model: "MTQ73CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MTQC3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MTQG3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MTQL3CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "128GB", model: "MTQ63CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MTQA3CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MTQF3CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MTQK3CH/A" }
  ],
  iPhone15ProMax: [
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MU2N3CH/A" },
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MU2T3CH/A" },
    { color: { value: "black", text: "\u9ED1\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MU2X3CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MU2P3CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MU2U3CH/A" },
    { color: { value: "white", text: "\u767D\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MU2Y3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MU2R3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MU2W3CH/A" },
    { color: { value: "blue", text: "\u84DD\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MU613CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "256GB", model: "MU2Q3CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "512GB", model: "MU2V3CH/A" },
    { color: { value: "primary", text: "\u539F\u8272\u949B\u91D1\u5C5E" }, capacity: "1TB", model: "MU603CH/A" }
  ]
};

// app/scripts/content/index.ts
console.log(`this is content`);
history.pushState = async function(...args) {
  const state = args[0];
  if (typeof history.onpushstate == "function") {
    history.onpushstate({ state });
  }
  console.log(`arguments`, args);
  let url = args[2] || "";
  url = url && url.search(/^http/) > -1 ? url : "";
  let pushResult = pushState.apply(history, args, iPhoneModels);
  console.log(`history`, history.length, location.href);
  return pushResult;
};
