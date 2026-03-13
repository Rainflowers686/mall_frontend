<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h1>我的购物车 <span>Cart Highlights</span></h1>
      </div>

      <div class="cart-main" v-if="cartData.length > 0">
        <div class="cart-items-section">
          <div class="product-item-card" v-for="item in cartData" :key="item.id">
            <div class="item-visual">
              <img :src="item.product.image" @click="router.push(`/product/${item.product.id}`)" />
            </div>

            <div class="item-details">
              <h3 @click="router.push(`/product/${item.product.id}`)">{{ item.product.name }}</h3>
              <div class="item-specs">
                <el-tag size="small" type="success" plain round>✨ 现货速发</el-tag>
                <el-tag size="small" type="info" plain round>官方正品</el-tag>
              </div>
            </div>

            <div class="item-pricing">
              <div class="unit-price">¥{{ item.product.price }}</div>
              <el-input-number v-model="item.nums" :min="1" @change="updateNums(item)" size="small" />
              <div class="subtotal">¥{{ (item.product.price * item.nums).toFixed(2) }}</div>
            </div>

            <el-button class="remove-btn" circle icon="Close" @click="deleteItem(item.id)" />
          </div>
        </div>

        <aside class="cart-summary-sidebar">
          <div class="summary-card">
            <h3>订单汇总</h3>
            <div class="summary-line"><span>商品总计</span><span>¥{{ totalAmount.toFixed(2) }}</span></div>
            <div class="summary-line"><span>运费</span><span style="color: #10b981;">免运费</span></div>
            <el-divider />
            <div class="summary-total"><span>总计金额</span><span class="total-val">¥{{ totalAmount.toFixed(2) }}</span></div>
            <el-button type="danger" class="checkout-pulse-btn" @click="submitOrder">去结算</el-button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../api/index'

const router = useRouter()
const cartData = ref([])

const fetchCart = async () => {
  const res = await request.get('cart/')
  cartData.value = res.data
}

const totalAmount = computed(() => cartData.value.reduce((total, item) => total + (item.product.price * item.nums), 0))

const updateNums = async (item) => await request.patch(`cart/${item.id}/`, { nums: item.nums })

const deleteItem = async (id) => {
  await request.delete(`cart/${id}/`)
  cartData.value = cartData.value.filter(i => i.id !== id)
  ElMessage.success('已移出购物车')
}

const submitOrder = () => router.push('/checkout')
onMounted(fetchCart)
</script>

<style scoped>
.cart-page { padding: 60px 0; min-height: 100vh; }
.cart-container { max-width: 1300px; margin: 0 auto; padding: 0 40px; }
.cart-header h1 { font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 40px; }

.cart-main { display: flex; gap: 40px; align-items: flex-start; }
.cart-items-section { flex: 1; }

.product-item-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px; padding: 30px; margin-bottom: 25px;
  display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
}

.item-visual { width: 120px; height: 120px; background: #fff; border-radius: 16px; padding: 10px; margin-right: 30px; }
.item-visual img { width: 100%; height: 100%; object-fit: contain; }

.item-details { flex: 1; }
.item-details h3 { font-size: 18px; font-weight: 700; color: #1e293b; }

.item-pricing { display: flex; align-items: center; gap: 30px; }
.subtotal { font-size: 20px; font-weight: 800; color: #ef4444; min-width: 100px; text-align: right; }

.summary-card {
  width: 360px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px);
  border-radius: 24px; padding: 40px; border: 1px solid #fff;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);
}
.total-val { font-size: 28px; font-weight: 800; color: #ef4444; }
.checkout-pulse-btn { width: 100%; padding: 25px 0; border-radius: 16px; font-size: 18px; font-weight: 800; }
</style>