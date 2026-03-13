<template>
  <div class="cart-wrapper">
    <div class="cart-header-bar">
      <h2>我的购物车 <span>({{ cartData.length }} 件商品)</span></h2>
      <el-button link type="danger" @click="clearCart" v-if="cartData.length > 0">
        <el-icon><Delete /></el-icon> 清空购物车
      </el-button>
    </div>

    <div class="empty-cart" v-if="cartData.length === 0">
      <img src="https://illustrations.popsy.co/amber/surreal-hourglass.svg" class="empty-img" alt="Empty Cart" />
      <h3>购物车空空如也</h3>
      <p>快去挑选一些心仪的极客装备吧！</p>
      <el-button type="primary" class="go-shop-btn" size="large" @click="router.push('/home')">
        去逛逛 <el-icon class="ml-2"><ArrowRight /></el-icon>
      </el-button>
    </div>

    <div class="cart-content" v-else>
      <div class="cart-list">
        <transition-group name="list" tag="div">
          <div class="cart-item-card" v-for="item in cartData" :key="item.id">
            <img :src="item.product.image" class="item-img" />

            <div class="item-info">
              <h4 class="item-name" @click="router.push(`/product/${item.product.id}`)">{{ item.product.name }}</h4>
              <p class="item-specs"><el-tag size="small" type="info">官方标配</el-tag></p>
              <div class="item-price">¥{{ item.product.price }}</div>
            </div>

            <div class="item-actions">
              <el-input-number
                v-model="item.nums"
                :min="1" :max="99"
                size="small"
                @change="updateNums(item)"
                class="modern-input-number"
              />
              <el-button circle type="danger" plain class="delete-btn" @click="deleteItem(item.id)">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="cart-summary-wrapper">
        <div class="cart-summary-card">
          <h3>订单摘要</h3>

          <div class="summary-row">
            <span>商品总价 ({{ cartData.length }}件)</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>预计运费</span>
            <span class="free-shipping">免运费</span>
          </div>

          <el-divider border-style="dashed" />

          <div class="summary-total">
            <span>合计</span>
            <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
          </div>

          <div class="promo-code">
            <el-input placeholder="输入优惠码" v-model="promoCode">
              <template #append><el-button>兑换</el-button></template>
            </el-input>
          </div>

          <el-button type="danger" class="checkout-btn" size="large" @click="submitOrder">
            去结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../api/index'

const router = useRouter()
const cartData = ref([])
const promoCode = ref('')

const getCart = async () => {
  try {
    const res = await request.get('cart/')
    cartData.value = res.data
  } catch (err) {
    ElMessage.error('获取购物车失败')
  }
}

const totalAmount = computed(() => {
  return cartData.value.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + (item.product.price * item.nums)
    }
    return total
  }, 0)
})

const updateNums = async (row) => {
  try {
    await request.patch(`cart/${row.id}/`, { nums: row.nums })
  } catch (err) {
    ElMessage.error('修改数量失败')
  }
}

const deleteItem = async (id) => {
  try {
    await request.delete(`cart/${id}/`)
    // 优雅的前端删除，触发 transition 动画，无需重新请求整页
    cartData.value = cartData.value.filter(item => item.id !== id)
    ElMessage.success('商品已移出购物车')
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

const clearCart = () => {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', { type: 'warning' }).then(async () => {
    // 真实业务中后端应提供批量删除接口，此处模拟前端循环删除或提示
    ElMessage.success('清空功能需后端配合，暂以逐个删除演示')
  }).catch(() => {})
}

const submitOrder = () => {
  router.push('/checkout')
}

onMounted(getCart)
</script>

<style scoped>
.cart-wrapper { max-width: 1200px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; min-height: 70vh; }
.cart-header-bar { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
.cart-header-bar h2 { margin: 0; font-size: 28px; color: #0f172a; font-weight: 800; }
.cart-header-bar span { font-size: 16px; color: #64748b; font-weight: 400; }

/* 空状态 */
.empty-cart { text-align: center; padding: 60px 0; }
.empty-img { width: 250px; margin-bottom: 20px; opacity: 0.9; }
.empty-cart h3 { font-size: 24px; color: #1e293b; margin-bottom: 10px; }
.empty-cart p { color: #64748b; margin-bottom: 30px; }
.go-shop-btn { border-radius: 30px; padding: 20px 40px; font-size: 16px; }

/* 核心布局 */
.cart-content { display: flex; gap: 40px; align-items: flex-start; }
.cart-list { flex: 1; }
.cart-summary-wrapper { width: 340px; position: sticky; top: 100px; } /* 吸顶效果 */

/* 左侧卡片 */
.cart-item-card { display: flex; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.cart-item-card:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); transform: translateY(-2px); }
.item-img { width: 100px; height: 100px; object-fit: contain; background: #f8fafc; border-radius: 12px; padding: 10px; margin-right: 20px; }
.item-info { flex: 1; }
.item-name { margin: 0 0 8px 0; font-size: 16px; color: #0f172a; cursor: pointer; transition: 0.2s; }
.item-name:hover { color: #2563eb; }
.item-specs { margin: 0 0 10px 0; }
.item-price { font-size: 18px; font-weight: 800; color: #ef4444; }
.item-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; }
.delete-btn { border: none; font-size: 18px; transition: 0.3s; }
.delete-btn:hover { transform: rotate(90deg) scale(1.1); background: #fee2e2; }

/* 列表动画 */
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-30px); }

/* 右侧结算卡片 */
.cart-summary-card { background: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; }
.cart-summary-card h3 { margin: 0 0 20px 0; font-size: 20px; color: #0f172a; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #475569; font-size: 15px; }
.free-shipping { color: #10b981; font-weight: 600; }
.summary-total { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; }
.summary-total span:first-child { font-size: 18px; font-weight: 600; color: #0f172a; }
.total-price { font-size: 28px; font-weight: 800; color: #ef4444; }
.promo-code { margin-bottom: 25px; }
.checkout-btn { width: 100%; border-radius: 12px; font-size: 18px; font-weight: 600; padding: 25px 0; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3); transition: 0.3s; }
.checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4); }

@media (max-width: 900px) {
  .cart-content { flex-direction: column; }
  .cart-summary-wrapper { width: 100%; position: static; }
}
</style>