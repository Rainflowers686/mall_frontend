<template>
  <div class="detail-wrapper" v-if="product">
    <div class="detail-main">
      <div class="gallery-section">
        <el-image :src="product.image" fit="contain" class="main-image" :preview-src-list="[product.image]" />
        <div class="image-features">
          <span>✨ 8K Ultra HD</span>
          <span>🛡️ 2年质保</span>
          <span>🚚 顺丰包邮</span>
        </div>
      </div>

      <div class="info-section">
        <h1 class="p-name">{{ product.name }}</h1>
        <p class="p-tagline">年度极客最受欢迎单品 · 极致生产力工具</p>

        <div class="price-card">
          <div class="price-row">
            <span class="label">售价</span>
            <span class="price">¥{{ product.price }}</span>
          </div>
        </div>

        <div class="spec-picker">
          <p class="spec-label">选择规格</p>
          <div class="spec-btns">
            <el-button class="spec-btn active">官方标配 (现货)</el-button>
            <el-button class="spec-btn">至尊尊享套装</el-button>
          </div>
        </div>

        <div class="buy-box">
          <el-input-number v-model="buyNums" :min="1" :max="10" size="large" />
          <el-button type="primary" class="add-btn" size="large" @click="addToCart">加入购物车</el-button>
        </div>
      </div>
    </div>

    <div class="cs-trigger" @click="drawerVisible = true">
      <el-badge is-dot color="#10b981">
        <el-icon><ChatDotRound /></el-icon>
      </el-badge>
      <span>联系客服</span>
    </div>

    <el-drawer v-model="drawerVisible" title="🎧 极客商城专属客服" size="400px">
      <div class="chat-container">
        <div class="chat-history">
          <div class="msg bot">您好！我是您的极客助手。关于这件 {{ product.name }} 有什么可以帮您？</div>
        </div>
        <div class="chat-input-box">
          <el-input placeholder="请输入您的问题..." v-model="chatInput">
            <template #append><el-button type="primary">发送</el-button></template>
          </el-input>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../api/index'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const buyNums = ref(1)
const drawerVisible = ref(false)
const chatInput = ref('')

const fetchProduct = async () => {
  const res = await request.get('products/')
  product.value = res.data.find(p => p.id === parseInt(route.params.id))
}

const addToCart = async () => {
  try {
    await request.post('cart/', { product_id: product.value.id, nums: buyNums.value })
    ElMessage.success('成功加入购物车！')
    router.push('/cart')
  } catch (err) {
    if (err.response?.status === 401) router.push('/login')
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.detail-wrapper { max-width: 1300px; margin: 60px auto; padding: 0 40px; font-family: 'Inter', sans-serif; }
.detail-main { display: flex; gap: 80px; }

.gallery-section { flex: 1.2; position: sticky; top: 100px; height: fit-content; }
.main-image { width: 100%; height: 500px; border-radius: 30px; background: #fff; border: 1px solid #f1f5f9; padding: 40px; box-sizing: border-box; }
.image-features { display: flex; justify-content: center; gap: 30px; margin-top: 30px; color: #94a3b8; font-size: 14px; font-weight: 600; }

.info-section { flex: 1; }
.p-name { font-size: 42px; font-weight: 800; color: #0f172a; margin-bottom: 10px; line-height: 1.2; }
.p-tagline { color: #2563eb; font-weight: 600; font-size: 18px; margin-bottom: 40px; }

.price-card { background: #f8fafc; padding: 30px; border-radius: 20px; margin-bottom: 40px; }
.price-row { display: flex; align-items: baseline; gap: 20px; }
.label { color: #64748b; font-size: 16px; }
.price { color: #ef4444; font-size: 38px; font-weight: 800; }

.spec-label { font-weight: 800; color: #1e293b; margin-bottom: 15px; }
.spec-btns { display: flex; gap: 15px; margin-bottom: 50px; }
.spec-btn { border-radius: 12px; padding: 25px 30px; font-weight: 600; border: 2px solid #e2e8f0; }
.spec-btn.active { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

.buy-box { display: flex; gap: 20px; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 40px; }
.add-btn { flex: 1; border-radius: 15px; font-size: 18px; font-weight: 800; padding: 28px 0; }

/* 🌟 在线客服浮动球 */
.cs-trigger { position: fixed; right: 40px; bottom: 40px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 15px 25px; border-radius: 50px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; z-index: 99; border: 1px solid #f1f5f9; }
.cs-trigger:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
.cs-trigger .el-icon { font-size: 24px; color: #2563eb; }
.cs-trigger span { font-weight: 800; color: #0f172a; font-size: 15px; }

.chat-container { display: flex; flex-direction: column; height: 100%; }
.chat-history { flex: 1; background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.msg.bot { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 85%; font-size: 14px; line-height: 1.6; }
</style>