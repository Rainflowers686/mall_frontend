<template>
  <div class="checkout-wrapper">
    <div class="checkout-container">
      <h1 class="page-title">确认订单 <span>Checkout</span></h1>

      <div class="checkout-content">
        <div class="main-col">
          <section class="checkout-section">
            <h3>1. 选择收货地址</h3>
            <div class="address-list" v-if="addresses.length > 0">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                :class="['address-card', { active: selectedAddressId === addr.id }]"
                @click="selectedAddressId = addr.id"
              >
                <div class="addr-header">
                  <span class="name">{{ addr.receiver }}</span>
                  <span class="phone">{{ addr.phone }}</span>
                  <el-tag v-if="addr.is_default" size="small" type="success" effect="plain">默认</el-tag>
                </div>
                <p class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
                <div class="check-icon" v-if="selectedAddressId === addr.id">
                  <el-icon><Check /></el-icon>
                </div>
              </div>
            </div>
            <div v-else class="no-address">
              <p>您还没有收货地址，请先前往个人中心添加。</p>
              <el-button type="primary" plain @click="router.push('/user')">去添加地址</el-button>
            </div>
          </section>

          <section class="checkout-section">
            <h3>2. 确认商品清单</h3>
            <div class="order-items">
              <div class="item-row" v-for="item in cartItems" :key="item.id">
                <img :src="item.product.image" class="item-img" />
                <div class="item-info">
                  <h4>{{ item.product.name }}</h4>
                  <p class="qty">数量: x{{ item.nums }}</p>
                </div>
                <div class="item-price">¥{{ (item.product.price * item.nums).toFixed(2) }}</div>
              </div>
            </div>
          </section>
        </div>

        <aside class="summary-col">
          <div class="sticky-summary">
            <h3>订单汇总</h3>
            <div class="summary-row">
              <span>商品小计</span>
              <span>¥{{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>运费</span>
              <span class="free">免运费</span>
            </div>

            <el-divider />

            <div class="total-row">
              <span>应付总额</span>
              <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
            </div>

            <el-input
              v-model="postScript"
              type="textarea"
              placeholder="给卖家留言（选填）"
              class="remark-input"
            />

            <el-button
              type="danger"
              class="submit-btn"
              :disabled="!selectedAddressId || cartItems.length === 0"
              :loading="isSubmitting"
              @click="handlePayment"
            >
              模拟支付并下单
            </el-button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../api/index'

const router = useRouter()
const addresses = ref([])
const cartItems = ref([])
const selectedAddressId = ref(null)
const postScript = ref('')
const isSubmitting = ref(false)

const fetchCart = async () => {
  try {
    const res = await request.get('cart/')
    cartItems.value = res.data
  } catch (err) {
    ElMessage.error('获取购物车失败')
  }
}

const fetchAddresses = async () => {
  try {
    const res = await request.get('addresses/')
    addresses.value = res.data
    const defaultAddr = addresses.value.find(a => a.is_default)
    if (defaultAddr) {
      selectedAddressId.value = defaultAddr.id
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  } catch (err) {
    ElMessage.error('获取地址失败')
  }
}

const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.product.price * item.nums), 0)
})

const handlePayment = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  isSubmitting.value = true
  try {
    // 🌟 1. 找到当前选中的完整地址对象
    const addr = addresses.value.find(a => a.id === selectedAddressId.value)

    // 🌟 2. 完美映射后端 Order 模型需要的字段快照
    const orderData = {
      signer_name: addr.receiver,             // 将 receiver 映射给 signer_name
      signer_mobile: addr.phone,              // 将 phone 映射给 signer_mobile
      address: `${addr.province}${addr.city}${addr.district}${addr.detail}`, // 拼接完整地址
      post_script: postScript.value,
      order_mount: totalAmount.value
    }

    await request.post('orders/', orderData)

    ElMessage.success('🎉 支付成功！订单已生成')
    router.push('/orders')

  } catch (err) {
    console.error('下单报错详情:', err.response?.data)

    let errorMsg = '下单失败，请检查后端接口。'
    if (err.response && err.response.data) {
      const data = err.response.data
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        if (firstKey) {
          const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]
          errorMsg = `后端拒绝 (${firstKey}): ${msg}`
        }
      }
    }
    ElMessage.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCart()
  fetchAddresses()
})
</script>

<style scoped>
/* 保持原样极简风格 */
.checkout-wrapper { padding: 40px 0; min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
.checkout-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.page-title { font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 30px; }
.page-title span { color: #94a3b8; font-weight: 400; font-size: 18px; margin-left: 10px; }
.checkout-content { display: flex; gap: 40px; align-items: flex-start; }
.main-col { flex: 1; display: flex; flex-direction: column; gap: 30px; }
.checkout-section { background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; }
.checkout-section h3 { margin: 0 0 20px 0; font-size: 18px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
.address-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.address-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; cursor: pointer; position: relative; transition: 0.3s; }
.address-card:hover { border-color: #93c5fd; }
.address-card.active { border-color: #3b82f6; background: #eff6ff; }
.addr-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.addr-header .name { font-weight: 700; color: #1e293b; }
.addr-header .phone { color: #64748b; font-size: 14px; }
.addr-detail { color: #475569; font-size: 14px; line-height: 1.5; margin: 0; }
.check-icon { position: absolute; right: -1px; bottom: -1px; background: #3b82f6; color: #fff; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 12px 0 12px 0; }
.no-address { text-align: center; padding: 20px 0; color: #64748b; }
.item-row { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px dashed #e2e8f0; }
.item-row:last-child { border-bottom: none; }
.item-img { width: 60px; height: 60px; object-fit: contain; border-radius: 8px; border: 1px solid #f1f5f9; margin-right: 20px; }
.item-info { flex: 1; }
.item-info h4 { margin: 0 0 5px 0; font-size: 15px; color: #1e293b; }
.item-info .qty { margin: 0; color: #64748b; font-size: 14px; }
.item-price { font-weight: 700; color: #0f172a; font-size: 16px; }
.summary-col { width: 340px; }
.sticky-summary { background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; position: sticky; top: 100px; box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
.sticky-summary h3 { margin: 0 0 20px 0; font-size: 18px; color: #0f172a; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #475569; font-size: 14px; }
.free { color: #10b981; font-weight: 600; }
.total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.total-row span:first-child { font-weight: 700; color: #1e293b; }
.total-price { font-size: 24px; font-weight: 800; color: #ef4444; }
.remark-input { margin-bottom: 20px; }
.submit-btn { width: 100%; padding: 25px 0; font-size: 18px; font-weight: 800; border-radius: 12px; }
</style>