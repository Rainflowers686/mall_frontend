<template>
  <div class="welcome-wrapper">
    <div class="hero-image-bg"></div>
    <div class="hero-overlay"></div>

    <header class="hero-nav">
      <div class="logo">🚀 极客商城</div>
      <el-button link class="nav-btn" @click="router.push('/login')">登录 / 注册</el-button>
    </header>

    <main class="hero-content">
      <div class="glass-card">
        <h1 class="hero-title">
          <span class="gradient-text">极客商城</span><br />
          重塑你的数字生活
        </h1>
        <p class="hero-subtitle">探索最前沿的专业数码装备，享受极致丝滑的购物体验。为发烧友而生，专为你打造 。</p>

        <div class="cta-group">
          <el-button type="primary" class="primary-btn" @click="router.push('/home')">
            立即购物 <el-icon class="ml-2"><ArrowRight /></el-icon>
          </el-button>
          <el-button class="secondary-btn" @click="router.push('/home')">
            探索热门
          </el-button>
        </div>
      </div>
    </main>

    <div class="scroll-hint">
      <el-icon class="bounce-icon"><ArrowDown /></el-icon>
      <span>向下滚动探索 </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.welcome-wrapper {
  width: 100vw; height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', 'Alibaba PuHuiTi', sans-serif;
}

/* 🌟 8K 全屏背景图与 Ken Burns 缩放动画 */
.hero-image-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2500&auto=format&fit=crop') center/cover no-repeat;
  animation: kenburns 20s infinite alternate;
}

@keyframes kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%);
  backdrop-filter: blur(2px);
}

.hero-nav {
  position: absolute;
  top: 0; width: 100%; padding: 40px 60px;
  display: flex; justify-content: space-between; align-items: center; z-index: 10;
  box-sizing: border-box;
}

.logo { color: #fff; font-size: 28px; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.nav-btn { color: #fff !important; font-size: 18px; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }

.hero-content {
  position: relative; z-index: 2;
  height: 100%; display: flex; align-items: center; justify-content: center;
}

/* 🌟 毛玻璃核心卡片 */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 80px;
  border-radius: 40px;
  text-align: center;
  max-width: 900px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.3);
}

.hero-title {
  color: #fff; font-size: 72px; font-weight: 800; line-height: 1.1; margin-bottom: 30px;
}

.gradient-text {
  background: linear-gradient(to right, #60a5fa, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24px; line-height: 1.6; margin-bottom: 50px;
}

.cta-group { display: flex; gap: 30px; justify-content: center; }

.primary-btn {
  background: #2563eb !important; border: none !important;
  font-size: 20px; padding: 30px 50px; border-radius: 20px; font-weight: 700;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
  transition: 0.3s;
}
.primary-btn:hover { transform: translateY(-5px); box-shadow: 0 30px 50px rgba(37, 99, 235, 0.5); }

.secondary-btn {
  background: rgba(255,255,255,0.1) !important; color: #fff !important;
  border: 2px solid rgba(255,255,255,0.3) !important;
  font-size: 20px; padding: 30px 50px; border-radius: 20px; font-weight: 700;
}
.secondary-btn:hover { background: rgba(255,255,255,0.2) !important; border-color: #fff !important; }

.scroll-hint {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; color: #fff; opacity: 0.7; z-index: 2;
}
.bounce-icon { font-size: 30px; margin-bottom: 10px; animation: bounce 2s infinite; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
}
</style>