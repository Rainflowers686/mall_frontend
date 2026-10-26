<div align="center">

# **Geek Mall Frontend**

Geek Mall 课程项目的 Vue 3 商城前端。

提供商品浏览、购物车、结算与订单页面，通过单独配置的 Django API 连接业务数据。

![Vue 3](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vuedotjs&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-Web%20Client-646CFF?logo=vite&logoColor=white) ![Status](https://img.shields.io/badge/Status-Course%20Project-586069)

[English](README.md) · [简体中文](README.zh-CN.md)

[项目状态](#项目状态) · [本地运行](#本地运行) · [连接后端](#连接后端) · [仓库内容](#仓库内容) · [参与贡献](CONTRIBUTING.md)

</div>

## 项目状态

课程项目，使用 Vite、Element Plus、Pinia、Vue Router 和 Axios。仓库包含欢迎页、商品列表与详情、登录、购物车、结算、订单和个人中心。完整购物流程依赖后端及其数据；现有界面不表示已具备生产支付或履约能力。

## 本地运行

准备与锁文件中 Vite 版本兼容的 Node.js 和 npm：

~~~sh
npm ci
npm run dev
~~~

`npm run build` 生成构建产物，`npm run preview` 在本地预览。

## 连接后端

共享 Axios 客户端位于 [src/api/index.js](src/api/index.js)，当前开发地址为 `http://127.0.0.1:8000/api/`。启动并配置 [mall_backend](https://github.com/Rainflowers686/mall_backend) 后，核对本机 API 地址和允许访问的前端来源。

客户端从浏览器存储中读取访问令牌，并以 Bearer 方式随请求发送。路由守卫会将未登录用户从购物车、结算、订单和个人中心引导至登录页；每次请求的权限仍需由后端验证。

## 仓库内容

- [src/views/](src/views/)：商城和账号页面。
- [src/router/index.js](src/router/index.js)：路由与跳转检查。
- [src/store/cart.js](src/store/cart.js)：购物车状态。
- [src/api/index.js](src/api/index.js)：HTTP 客户端。
- [public/](public/)：静态资源。
- [package.json](package.json) 与 [package-lock.json](package-lock.json)：脚本与依赖。

## 贡献与安全

构建与提交要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。令牌泄露、不安全的 HTML 或越权访问问题按 [SECURITY.md](SECURITY.md) 处理。

## 许可与资源

本仓库尚未声明整仓许可证。商品图片、品牌素材和其他第三方内容保留原有权利；再分发前应取得相应授权。
