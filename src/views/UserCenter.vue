<template>
  <div class="user-page-container">
    <div class="modern-user-wrapper">
      <aside class="glass-sidebar">
        <div class="user-profile">
          <div class="avatar-glow">
            <el-avatar :size="80" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Geek" />
          </div>
          <h3>Geek User</h3>
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
          <el-button type="primary" size="large" round @click="openDialog('add')">立即创建</el-button>
        </div>

        <div class="address-cards-grid" v-else>
          <div v-for="addr in addressList" :key="addr.id" :class="['modern-addr-card', { 'is-default': addr.is_default }]">
            <div class="card-top">
              <span class="signer-tag">{{ addr.receiver }}</span>
              <span class="phone-num">{{ addr.phone }}</span>
              <el-tag v-if="addr.is_default" type="success" effect="dark" round size="small">默认</el-tag>
            </div>
            <p class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
            <div class="card-footer">
              <el-button link type="primary" @click="openDialog('edit', addr)">编辑</el-button>
              <el-button link type="danger" @click="deleteAddress(addr.id)">删除</el-button>
              <el-button link type="warning" v-if="!addr.is_default" @click="setDefault(addr)">设为默认</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增地址' : '编辑地址'" width="550px">
      <el-form :model="addressForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收件人">
              <el-input v-model="addressForm.receiver" placeholder="真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="addressForm.phone" placeholder="11位手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="省份">
              <el-input v-model="addressForm.province" placeholder="如: 山东省" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市">
              <el-input v-model="addressForm.city" placeholder="如: 青岛市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区/县">
              <el-input v-model="addressForm.district" placeholder="如: 崂山区" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址 (街道、楼牌号等)">
          <el-input v-model="addressForm.detail" type="textarea" :rows="2" placeholder="如：中国海洋大学XX校区XX号楼" />
        </el-form-item>

        <el-form-item>
          <el-switch v-model="addressForm.is_default" active-text="设为默认收货地址" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">保存并提交</el-button>
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
const dialogVisible = ref(false)
const dialogType = ref('add')

// 🌟 数据结构替换为 detail
const addressForm = ref({
  id: null,
  receiver: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  is_default: false
})

const fetchAddresses = async () => {
  try {
    const res = await request.get('addresses/')
    addressList.value = res.data.sort((a, b) => b.is_default - a.is_default)
  } catch (err) {
    ElMessage.error('无法获取地址列表')
  }
}

const openDialog = (type, row = null) => {
  dialogType.value = type
  if (row) {
    addressForm.value = { ...row }
  } else {
    addressForm.value = { id: null, receiver: '', phone: '', province: '', city: '', district: '', detail: '', is_default: false }
  }
  dialogVisible.value = true
}

const submitAddress = async () => {
  if (!addressForm.value.receiver || !addressForm.value.phone || !addressForm.value.province || !addressForm.value.detail) {
    ElMessage.warning('请将带*的关键信息填写完整！')
    return
  }

  try {
    // 🌟 payload 替换为 detail
    const payload = {
      receiver: addressForm.value.receiver,
      phone: addressForm.value.phone,
      province: addressForm.value.province,
      city: addressForm.value.city,
      district: addressForm.value.district,
      detail: addressForm.value.detail,
      is_default: addressForm.value.is_default
    }

    if (dialogType.value === 'add') {
      await request.post('addresses/', payload)
      ElMessage.success('🎉 地址添加成功！')
    } else {
      await request.put(`addresses/${addressForm.value.id}/`, payload)
      ElMessage.success('🎉 地址修改成功！')
    }
    dialogVisible.value = false
    fetchAddresses()

  } catch (err) {
    console.error('后端原始报错详情:', err.response?.data)
    let errorMsg = '保存失败，请检查后端接口。'
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
  }
}

const deleteAddress = (id) => {
  ElMessageBox.confirm('确定要删除这个地址吗？', '提示', { type: 'warning' }).then(async () => {
    try {
      await request.delete(`addresses/${id}/`)
      ElMessage.success('删除成功')
      fetchAddresses()
    } catch (err) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const setDefault = async (row) => {
  try {
    await request.patch(`addresses/${row.id}/`, { is_default: true })
    ElMessage.success('已设为默认地址')
    fetchAddresses()
  } catch (err) {
    ElMessage.error('设置失败')
  }
}

const handleLogout = () => { localStorage.clear(); router.push('/login'); }

onMounted(fetchAddresses)
</script>

<style scoped>
.user-page-container { padding: 60px 0; min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif;}
.modern-user-wrapper { max-width: 1300px; margin: 0 auto; display: flex; gap: 50px; padding: 0 40px; }

.glass-sidebar { width: 320px; background: #fff; border-radius: 20px; padding: 50px 30px; border: 1px solid #e2e8f0; height: fit-content; }
.user-profile { text-align: center; margin-bottom: 40px; }
.avatar-glow { display: inline-block; padding: 5px; background: #3b82f6; border-radius: 50%; }
.nav-item { padding: 15px 20px; border-radius: 12px; margin-bottom: 10px; font-weight: 600; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
.nav-item.active { background: #3b82f6; color: #fff; }
.nav-item:hover:not(.active) { background: #f1f5f9; }
.logout { color: #ef4444; margin-top: 30px; }

.address-content { flex: 1; }
.address-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.address-header h1 { font-size: 28px; font-weight: 800; color: #1e293b; }

.empty-state-illustrate { text-align: center; padding: 80px 0; background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; }
.empty-state-illustrate img { width: 200px; margin-bottom: 20px; }

.address-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; }
.modern-addr-card { background: #fff; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0; transition: 0.3s; }
.modern-addr-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.modern-addr-card.is-default { border-color: #3b82f6; background: #eff6ff; border-left: 6px solid #3b82f6; }

.card-top { margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
.signer-tag { font-size: 18px; font-weight: 700; color: #1e293b; }
.phone-num { font-size: 14px; color: #64748b; }
.addr-detail { color: #475569; line-height: 1.5; font-size: 14px; margin-bottom: 20px; min-height: 42px; }
.card-footer { display: flex; justify-content: flex-end; gap: 15px; border-top: 1px dashed #e2e8f0; padding-top: 15px; }
</style>