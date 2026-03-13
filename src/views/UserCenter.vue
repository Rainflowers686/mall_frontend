<template>
  <div class="user-page-container">
    <div class="modern-user-wrapper">
      <aside class="glass-sidebar">
        <div class="user-profile">
          <div class="avatar-glow">
            <el-avatar :size="80" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Geek" />
          </div>
          <h3>{{ userInfo.name || 'Li Yurun' }}</h3>
          <p class="membership-tag">💎 极客黄金会员</p>
        </div>
        <nav class="side-nav">
          <div class="nav-item active"><el-icon><Location /></el-icon> <span>地址管理</span></div>
          <div class="nav-item" @click="router.push('/orders')"><el-icon><List /></el-icon> <span>我的订单</span></div>
          <div class="nav-item logout" @click="handleLogout"><el-icon><SwitchButton /></el-icon> <span>退出登录</span></div>
        </nav>
      </aside>

      <main class="address-content">
        <div class="address-header">
          <h1>收货地址管理</h1>
          <el-button type="primary" class="fancy-add-btn" icon="Plus" @click="openDialog('add')">添加新地址</el-button>
        </div>

        <div class="empty-state-illustrate" v-if="addressList.length === 0">
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png" alt="Empty" />
          <h2>这里还没有坐标...</h2>
          <p>添加一个收货地址，开启你的全球极客之旅</p>
          <el-button type="primary" size="large" round @click="openDialog('add')">立即创建</el-button>
        </div>

        <div class="address-cards-grid" v-else>
          <div v-for="addr in addressList" :key="addr.id" :class="['modern-addr-card', { 'is-default': addr.is_default }]">
            <div class="card-top">
              <span class="signer-tag">{{ addr.signer_name }}</span>
              <span class="phone-num">{{ addr.signer_mobile }}</span>
              <el-tag v-if="addr.is_default" type="success" effect="dark" round size="small">默认</el-tag>
            </div>
            <p class="addr-detail">{{ addr.address }}</p>
            <div class="card-footer">
              <el-button link type="primary" @click="openDialog('edit', addr)">编辑</el-button>
              <el-button link type="danger" @click="deleteAddress(addr.id)">删除</el-button>
              <el-button link type="warning" v-if="!addr.is_default" @click="setDefault(addr)">设为默认</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增地址' : '编辑地址'" width="500px">
      <el-form :model="addressForm" label-position="top">
        <el-form-item label="收件人"><el-input v-model="addressForm.signer_name" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="addressForm.signer_mobile" /></el-form-item>
        <el-form-item label="详细地址"><el-input v-model="addressForm.address" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../api/index'

const router = useRouter()
const addressList = ref([])
const userInfo = ref({ name: 'Li Yurun' })
const dialogVisible = ref(false)
const dialogType = ref('add')
const addressForm = ref({ id: null, signer_name: '', signer_mobile: '', address: '', is_default: false })

const fetchAddresses = async () => {
  const res = await request.get('addresses/')
  addressList.value = res.data.sort((a, b) => b.is_default - a.is_default)
}

const openDialog = (type, row = null) => {
  dialogType.value = type
  if (row) addressForm.value = { ...row }
  else addressForm.value = { id: null, signer_name: '', signer_mobile: '', address: '', is_default: false }
  dialogVisible.value = true
}

const submitAddress = async () => {
  if (dialogType.value === 'add') await request.post('addresses/', addressForm.value)
  else await request.put(`addresses/${addressForm.value.id}/`, addressForm.value)
  dialogVisible.value = false
  fetchAddresses()
}

const deleteAddress = (id) => {
  ElMessageBox.confirm('确定删除？').then(async () => {
    await request.delete(`addresses/${id}/`)
    fetchAddresses()
  })
}

const setDefault = async (row) => {
  await request.patch(`addresses/${row.id}/`, { is_default: true })
  fetchAddresses()
}

const handleLogout = () => { localStorage.clear(); router.push('/login'); }

onMounted(fetchAddresses)
</script>

<style scoped>
.user-page-container { padding: 60px 0; min-height: 100vh; }
.modern-user-wrapper { max-width: 1300px; margin: 0 auto; display: flex; gap: 50px; padding: 0 40px; }

.glass-sidebar {
  width: 320px; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px);
  border-radius: 32px; padding: 50px 30px; border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 20px 50px rgba(0,0,0,0.05); height: fit-content;
}

.address-content { flex: 1; }
.address-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.address-header h1 { font-size: 32px; font-weight: 800; color: #1e293b; }

.empty-state-illustrate { text-align: center; padding: 80px 0; background: rgba(255,255,255,0.5); border-radius: 30px; border: 1px dashed #cbd5e1; }
.empty-state-illustrate img { width: 300px; margin-bottom: 20px; }

.modern-addr-card {
  background: rgba(255,255,255,0.8); backdrop-filter: blur(10px);
  border-radius: 24px; padding: 30px; border: 1px solid #fff;
  transition: 0.3s; margin-bottom: 25px;
}
.modern-addr-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
.modern-addr-card.is-default { border-left: 8px solid #2563eb; background: #eff6ff; }
</style>