## iPhoneOrder.2023

<b>2023版 iPhone 自动抢购插件</b>

苹果官网本身并未限制 iPhone 下单，但选择配送可能交付时间过长。该插件用于自动捡漏可门店自提的订单。


<b>********** 该插件仅用于学习和交流 **********</b>

------

### 目前发现并且遗留的问题
2023.09.17 更新

1. 苹果调整了取货店铺信息的接口，插件需要调整；
2. 注入 history.pushState 的方式目前未生效，导致页面跳转之后没有继续执行。

<br/>

------

### 安装和使用
1. 点击下载安装 [Release](https://github.com/loo-y/iPhoneOrder.2023/releases/)

2. 解压缩到本地任意目录

3. 打开Chrome 或者 Edge 浏览器

4. 找到管理扩展程序
   <br/><img src='./public/assets/images/SCR-20230916-nbkz.png' width="800px" />

5. 开启开发者模式， 点击 "加载已解压缩的程序" 
   <br/><img src='./public/assets/images/SCR-20230916-nbyv.png' width="800px" />

6. 选中刚才解压缩的 iPhoneOrder 文件夹
   <br/><img src='./public/assets/images/SCR-20230916-ncte.png' width="600px" />

7. 安装成功之后可以在扩展程序中看到已应用
   <br/><img src='./public/assets/images/SCR-20230916-ndgw.png' width="600px" />

8. 点击左上角扩展程序标志，找到 iPhoneOrder 并固定
   <br/><img src='./public/assets/images/SCR-20230916-ndks.png' width="350px" />

9. iPhoneOrder将被固定在右上角，点击打开，选择配置
   <br/><img src='./public/assets/images/SCR-20230916-neaa.png' width="350px" />

10. 填写必要的配置信息
   <br/><img src='./public/assets/images/SCR-20230916-neeq.jpeg' width="800px" />

11. 打开 苹果官网，将想要的 iPhone 预先放入购物车，点击开启，并确认
   <br/><img src='./public/assets/images/SCR-20230916-nfkt.png' width="800px" />

<br/>

------

### 注意
插件将会自动刷新抢购，请保持电脑不要自动休眠。

同一个浏览器的配置是共享的，所以一个浏览器只能抢购一部，如果需要同时抢购，可以开启多个 Chrome 个人配置，分别安装。

需要注意的是，同一个 IP 访问次数过多，会导致暂时性的无法访问或者拒绝访问。

