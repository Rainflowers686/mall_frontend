<template>
  <div class="orders-wrapper">
    <div class="page-header">
      <h2>我的订单 <span>Manage your orders</span></h2>
    </div>

    <el-tabs v-model="activeTab" class="modern-tabs">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待支付" name="paying"></el-tab-pane>
      <el-tab-pane label="待发货" name="unshipped"></el-tab-pane>
      <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
      <el-tab-pane label="已完成" name="done"></el-tab-pane>
    </el-tabs>

    <div class="empty-orders" v-if="filteredOrders.length === 0">
      <div class="lottie-box">
        <img src="https://illustrations.popsy.co/amber/clumsy-waiter.svg" alt="Empty" />
      </div>
      <h3>这里空空如也，没有相关的订单哦~</h3>
      <el-button type="primary" size="large" round @click="router.push('/home')">去买点什么</el-button>
    </div>

    <div class="order-list" v-else>
      <div class="order-card" v-for="order in filteredOrders" :key="order.id">
        <div class="order-card-header">
          <div class="order-meta">
            <span class="order-time">{{ formatDate(order.add_time) }}</span>
            <span class="order-sn">订单号: {{ order.order_sn }}</span>
          </div>
          <el-tag :type="getStatusTag(order.pay_status)" effect="dark" round>
            {{ getStatusText(order.pay_status) }}
          </el-tag>
        </div>

        <div class="order-card-content">
          <div class="product-previews">
            <div class="img-box" v-for="n in 1" :key="n">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop" />
            </div>
            <div class="more-indicator" v-if="order.goods_count > 1">+{{ order.goods_count - 1 }}</div>
          </div>

          <div class="order-info">
            <p class="signer">收货人：{{ order.signer_name }}</p>
            <p class="amount">实付金额：<span>¥{{ order.order_mount }}</span></p>
          </div>

          <div class="order-actions">
            <el-button plain size="default" v-if="order.pay_status === 'shipped'">物流追踪</el-button>
            <el-button type="primary" size="default" v-if="order.pay_status === 'paying'">立即支付</el-button>
            <el-button plain size="default">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/index'

const router = useRouter()
const activeTab = ref('all')
const orders = ref([])

const getOrders = async () => {
  try {
    const res = await request.get('orders/')
    orders.value = res.data
  } catch (err) {}
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.pay_status === activeTab.value)
})

const getStatusTag = (status) => {
  const map = { paying: 'warning', unshipped: 'primary', shipped: 'info', done: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { paying: '待支付', unshipped: '待发货', shipped: '待收货', done: '已完成' }
  return map[status] || status
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(getOrders)
</script>

<style scoped>
.orders-wrapper { max-width: 1000px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
.page-header h2 { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 30px; }
.page-header span { font-size: 16px; color: #94a3b8; font-weight: 400; margin-left: 10px; }

.modern-tabs :deep(.el-tabs__item) { font-size: 16px; font-weight: 600; padding: 0 25px; height: 50px; }
.modern-tabs :deep(.el-tabs__active-bar) { height: 3px; border-radius: 3px; background-color: #2563eb; }

.empty-orders { text-align: center; padding: 100px 0; }
.lottie-box img { width: 240px; margin-bottom: 20px; }
.empty-orders h3 { color: #64748b; font-size: 18px; margin-bottom: 30px; }

.order-list { margin-top: 30px; }
.order-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 25px; margin-bottom: 25px; transition: 0.3s; }
.order-card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.05); }

.order-card-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 20px; }
.order-time { font-weight: 800; color: #1e293b; margin-right: 20px; }
.order-sn { color: #94a3b8; font-size: 14px; }

.order-card-content { display: flex; align-items: center; justify-content: space-between; }
.product-previews { display: flex; align-items: center; gap: 10px; }
.img-box { width: 80px; height: 80px; border-radius: 12px; border: 1px solid #f1f5f9; overflow: hidden; }
.img-box img { width: 100%; height: 100%; object-fit: cover; }
.more-indicator { color: #94a3b8; font-weight: 600; }

.order-info { flex: 1; margin-left: 40px; }
.signer { color: #64748b; margin-bottom: 8px; font-size: 15px; }
.amount { color: #1e293b; font-weight: 600; }
.amount span { color: #ef4444; font-size: 20px; font-weight: 800; }

.order-actions { display: flex; gap: 12px; }
</style>