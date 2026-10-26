<div align="center">

# **Geek Mall Frontend**

A Vue 3 storefront for the Geek Mall coursework project.

Browse products, manage a cart and follow an order flow through pages backed by a separately configured Django API.

![Vue 3](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vuedotjs&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-Web%20Client-646CFF?logo=vite&logoColor=white) ![Status](https://img.shields.io/badge/Status-Course%20Project-586069)

[English](README.md) · [简体中文](README.zh-CN.md)

[Status](#project-status) · [Start locally](#start-locally) · [Backend](#connect-the-backend) · [Files](#repository-contents) · [Contribute](CONTRIBUTING.md)

</div>

## Project status

Course project built with Vite, Element Plus, Pinia, Vue Router and Axios. The repository includes welcome, product-list, product-detail, login, cart, checkout, order and user-center pages. A live shopping flow depends on the backend and its data; the UI does not establish production payment or fulfillment support.

## Start locally

Use Node.js and npm compatible with the locked Vite version:

~~~sh
npm ci
npm run dev
~~~

`npm run build` creates the bundle and `npm run preview` previews it locally.

## Connect the backend

The shared Axios client is [src/api/index.js](src/api/index.js). Its current development base URL is `http://127.0.0.1:8000/api/`. Start and configure [mall_backend](https://github.com/Rainflowers686/mall_backend), then check the API URL and allowed origins for your environment.

The client reads an access token from browser storage and attaches it as a Bearer token. The route guard redirects unauthenticated visitors from cart, checkout, orders and user-center pages; backend authorization must still validate every request.

## Repository contents

- [src/views/](src/views/): storefront and account pages.
- [src/router/index.js](src/router/index.js): routes and navigation checks.
- [src/store/cart.js](src/store/cart.js): cart state.
- [src/api/index.js](src/api/index.js): HTTP client.
- [public/](public/): static assets.
- [package.json](package.json) and [package-lock.json](package-lock.json): scripts and dependencies.

## Contributing and security

Build checks and review expectations are in [CONTRIBUTING.md](CONTRIBUTING.md). For token exposure, unsafe HTML or data-access issues, use [SECURITY.md](SECURITY.md).

## License and assets

No repository-wide license has been declared. Product images, branding and other third-party material retain their own rights. Obtain the appropriate permission before redistributing project contents.
