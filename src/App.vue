<template>
  <div id="app-root">
    <div class="fixed-bg"></div>
    <router-view />
  </div>
</template>

<style>
/* 全局基础重置：确保不留白 */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f0f2f5; /* 稳定底色 */
}

/* 🌟 核心：全景沉浸背景（对标 Apple 官网质感） */
.fixed-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: -1;
  /* 组合：线性渐变 + 高端几何微纹理 */
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(255, 255, 255, 0) 50%),
    url('https://www.transparenttextures.com/patterns/white-diamond.png'),
    #f8fafc;
  background-attachment: fixed;
}

#app-root {
  font-family: 'Inter', 'Alibaba PuHuiTi', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 优化所有按钮的全局动效 */
.el-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
</style>