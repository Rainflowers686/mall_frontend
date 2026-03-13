# 🎨 Geek Mall Frontend
### 极客商城前端沉浸式 UI 系统

![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)
![Vite](https://img.shields.io/badge/Vite-Frontend-blue)
![ElementPlus](https://img.shields.io/badge/UI-ElementPlus-blue)
![Axios](https://img.shields.io/badge/HTTP-Axios-orange)
![License](https://img.shields.io/badge/license-MIT-green)

<p align="center">
Vue3 + Vite 构建的现代化电商前端 | Apple 风格 UI | 前后端完全分离
</p>

---

# 📖 项目简介

**Geek Mall Frontend** 是极客商城系统的客户端部分，基于 **Vue 3 + Vite** 构建。

项目采用 **前后端完全分离架构**，通过 RESTful API 与 Django 后端服务通信，为用户提供 **高性能、现代化的数码商品购物体验**。

视觉设计深度参考：

- **Apple 官网**
- **Shopify 电商 UI**

整体设计目标：

- 极简
- 高端
- 流畅
- 沉浸式体验

---

# 🧱 技术架构 (Tech Stack)

| 技术 | 说明 |
|-----|-----|
| **Vue 3** | 前端框架 |
| **Composition API** | Vue3 组合式开发 |
| **Vite** | 前端构建工具 |
| **Element Plus** | UI 组件库 |
| **Axios** | HTTP 请求库 |
| **Pinia (可扩展)** | 状态管理 |
| **RESTful API** | 与 Django 后端通信 |

---

# 🏗️ 前后端架构

```
        ┌──────────────────────┐
        │   Geek Mall Frontend │
        │   Vue3 + Vite        │
        └───────────┬──────────┘
                    │
                    │ REST API
                    ▼
        ┌──────────────────────┐
        │   Geek Mall Backend  │
        │   Django + DRF       │
        └───────────┬──────────┘
                    │
                    ▼
                MySQL 8.0
```

---

# ✨ 核心 UI 设计

## 🌌 全屏欢迎页 (Welcome)

设计灵感来源于 **Apple 官网 Hero Section**。

特点：

- 全屏视觉展示
- 高分辨率背景
- 沉浸式入口体验

---

## 🛍️ 商品首页 (Home)

核心商品展示页：

- 商品网格布局
- 大圆角卡片设计
- Hover 动画效果
- 左侧分类实时筛选

设计风格：

```
Apple Store + Shopify
```

---

## 🛒 购物车中心 (Cart)

参考 **Shopify 购物车布局**：

```
左侧
商品卡片列表

右侧
订单汇总 + Sticky 结算栏
```

特点：

- 商品数量修改
- 实时价格计算
- 一键结算

---

## 👤 用户中心 (User Center)

提供用户信息管理：

- 地址管理
- 默认地址切换
- 订单查看

UI 风格参考 **iOS 设置页面**。

---

## 📦 订单追踪 (Orders)

订单状态使用 **彩色状态徽章**：

```
待支付
待发货
待收货
已完成
已取消
```

用户可以快速查看订单状态。

---

# 📡 API 通信机制

项目通过 **Axios** 与 Django 后端通信。

统一封装：

```
src/api/
```

核心功能：

- 自动注入 JWT Token
- 请求拦截
- 响应错误处理

示例：

```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

# 📂 项目结构

```
mall_frontend
│
├─ public
│
├─ src
│   │
│   ├─ api                # API 请求封装
│   ├─ assets             # 图片资源
│   ├─ components         # 公共组件
│   │
│   ├─ views
│   │   ├─ Welcome.vue
│   │   ├─ Home.vue
│   │   ├─ Cart.vue
│   │   ├─ Orders.vue
│   │   └─ UserCenter.vue
│   │
│   ├─ router             # Vue Router
│   ├─ App.vue
│   └─ main.js
│
├─ index.html
├─ package.json
└─ README.md
```

---

# 🚀 快速启动 (Quick Start)

## 1️⃣ 安装 Node 环境

建议版本：

```
Node.js >= 16
```

---

## 2️⃣ 安装依赖

进入项目目录：

```bash
cd mall_frontend
```

安装依赖：

```bash
npm install
```

---

## 3️⃣ 启动开发服务器

```bash
npm run dev
```

默认访问地址：

```
http://localhost:5173
```

---

# ⚠️ 运行前提

前端运行前请确保 **后端 API 服务已启动**：

```
http://127.0.0.1:8000
```

否则页面无法加载商品数据。

后端仓库：

```
mall_backend
```

---

# 📦 生产环境构建

构建生产版本：

```bash
npm run build
```

构建完成后会生成：

```
dist/
```

该目录包含：

- HTML
- JS
- CSS
- 静态资源

可直接部署到：

- Nginx
- CDN
- 静态服务器

---

# 📊 项目亮点

✔ Apple 风格 UI 设计  
✔ Shopify 级购物体验  
✔ Vue3 + Vite 高性能架构  
✔ Axios 自动 Token 注入  
✔ 前后端完全分离  
✔ RESTful API 通信  

适用于：

- 🎓 计算机课程设计
- 💼 前端 / 全栈实习项目
- 📚 Vue3 学习项目
- 🚀 电商系统实践

---

# 👨‍💻 Author

**Rain (Li Yurun)**

Computer Science Student  
Full Stack Developer

GitHub:

```
https://github.com/yourname
```

---

# 🔗 Related Projects

| 项目 | 描述 |
|-----|-----|
| **Geek Mall Backend** | Django + DRF 电商后端 |
| **Geek Mall Frontend** | Vue3 电商前端 |

---

# ⭐ License

This project is for **learning and academic purposes only**.
