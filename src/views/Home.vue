<template>
  <div class="home-page">
    <el-affix :offset="0">
      <header class="master-header">
        <div class="header-inner">
          <div class="logo" @click="router.push('/')">🚀 极客商城</div>

          <div class="search-area">
            <el-input
              v-model="searchQuery"
              placeholder="搜索全站 8K 顶级数码装备..."
              class="apple-search"
              clearable
            >
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
          </div>

          <div class="user-tools">
            <el-badge :value="cartCount" :hidden="cartCount === 0" class="tool-badge">
              <el-button circle icon="ShoppingCart" @click="router.push('/cart')" />
            </el-badge>
            <el-dropdown @command="handleCmd" trigger="click">
              <el-button circle icon="User" class="user-trigger" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="user">📍 地址管理</el-dropdown-item>
                  <el-dropdown-item command="orders">🧾 我的订单</el-dropdown-item>
                  <el-dropdown-item divided command="logout">🚪 退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </header>
    </el-affix>

    <section class="hero-section">
      <el-carousel height="480px" motion-blur :interval="5000" class="hero-carousel">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-box" :style="{ backgroundImage: `url(${banner.img})` }">
            <div class="banner-mask">
              <div class="banner-text">
                <h2>{{ banner.title }}</h2>
                <el-button type="primary" size="large" round class="banner-btn">立即探索</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <main class="content-container">
      <aside class="side-nav">
        <h3 class="side-title">探索分类</h3>
        <el-menu :default-active="activeCat" class="category-menu" @select="v => activeCat = v">
          <el-menu-item index="">🔥 极客热推</el-menu-item>
          <el-menu-item index="数码">💻 电脑数码</el-menu-item>
          <el-menu-item index="摄影">📷 摄影摄像</el-menu-item>
          <el-menu-item index="外设">🖱️ 极客外设</el-menu-item>
          <el-menu-item index="学习">📚 学习资源</el-menu-item>
        </el-menu>
      </aside>

      <div class="product-wall">
        <div class="wall-header">
          <h2>{{ activeCat ? `分类：${activeCat}` : '🔥 极客热推' }}</h2>
          <span>共找到 {{ filteredProducts.length }} 款尖货</span>
        </div>

        <el-row :gutter="25">
          <el-col v-for="p in filteredProducts" :key="p.id" :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
            <div class="apple-card" @click="router.push(`/product/${p.id}`)">
              <div class="img-container">
                <img :src="p.image" loading="lazy" />
                <div class="quick-add" @click.stop="addCart(p.id)">
                  <el-icon><Plus /></el-icon>
                </div>
              </div>
              <div class="card-info">
                <h4 class="name">{{ p.name }}</h4>
                <div class="price-row">
                  <span class="price">¥{{ p.price }}</span>
                  <el-tag size="small" type="danger" effect="plain">限时特惠</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../api/index'

const router = useRouter()
const activeCat = ref('')
const searchQuery = ref('')
const allProducts = ref([])
const cartCount = ref(0)

const banners = [
  { img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop', title: '全套复古数码装备直降' },
  { img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop', title: '极客装机节：信仰充值' },
  { img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop', title: '生产力工具 全面大升级' }
]

const fetchProducts = async () => {
  const res = await request.get('products/')
  allProducts.value = res.data
}

const filteredProducts = computed(() => {
  return allProducts.value.filter(p => {
    const s = searchQuery.value.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(s)
    const matchCat = activeCat.value ? p.name.includes(activeCat.value) : true
    return matchSearch && matchCat
  })
})

const addCart = async (id) => {
  try {
    await request.post('cart/', { product_id: id, nums: 1 })
    ElMessage.success('已加入购物车')
    cartCount.value++
  } catch (err) {
    if (err.response?.status === 401) router.push('/login')
  }
}

const handleCmd = (cmd) => {
  if (cmd === 'logout') { localStorage.clear(); router.push('/login'); }
  else router.push(`/${cmd}`)
}

onMounted(fetchProducts)
</script>

<style scoped>
.home-page { min-height: 100vh; padding-bottom: 80px; }

/* 🌟 顶栏：高度锁定，防止塌陷 */
.master-header {
  height: 70px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  display: flex; align-items: center;
}
.header-inner {
  max-width: 1400px; margin: 0 auto; width: 100%;
  display: flex; justify-content: space-between; align-items: center; padding: 0 40px;
}
.logo { font-size: 22px; font-weight: 900; color: #1e293b; cursor: pointer; letter-spacing: -1px; }
.search-area { flex: 0 1 500px; }
.apple-search :deep(.el-input__wrapper) { border-radius: 12px; background: rgba(0,0,0,0.03); box-shadow: none !important; }

/* 🌟 轮播图：铺满感 */
.hero-section { max-width: 1400px; margin: 30px auto; padding: 0 40px; }
.hero-carousel { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.banner-box { width: 100%; height: 100%; background-size: cover; background-position: center; position: relative; }
.banner-mask { width: 100%; height: 100%; background: linear-gradient(to right, rgba(0,0,0,0.6), transparent); display: flex; align-items: center; padding-left: 80px; }
.banner-text h2 { color: #fff; font-size: 42px; font-weight: 800; margin-bottom: 30px; max-width: 500px; }
.banner-btn { padding: 25px 50px; font-weight: 700; font-size: 18px; }

/* 🌟 主体容器 */
.content-container { max-width: 1400px; margin: 50px auto; display: flex; gap: 40px; padding: 0 40px; }
.side-nav { width: 220px; flex-shrink: 0; }
.side-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 25px; }
.category-menu { border: none !important; background: transparent !important; }
.category-menu :deep(.el-menu-item) {
  border-radius: 12px; height: 55px; margin-bottom: 8px; font-weight: 700; color: #64748b;
}
.category-menu :deep(.el-menu-item.is-active) {
  background: #2563eb !important; color: #fff !important; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

/* 🌟 商品卡片：Apple 风格核心实现  */
.product-wall { flex: 1; }
.wall-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
.wall-header h2 { font-size: 26px; font-weight: 800; color: #0f172a; }

.apple-card {
  background: #fff; border-radius: 16px; overflow: hidden; margin-bottom: 30px;
  cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}
.apple-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }

.img-container { height: 260px; background: #fff; position: relative; display: flex; align-items: center; justify-content: center; padding: 30px; }
.img-container img { max-width: 100%; max-height: 100%; object-fit: contain; transition: 0.5s; }
.apple-card:hover img { transform: scale(1.1); }

.quick-add {
  position: absolute; right: 20px; bottom: 20px; width: 45px; height: 45px;
  background: #2563eb; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 20px; opacity: 0; transform: translateY(10px); transition: 0.3s;
}
.apple-card:hover .quick-add { opacity: 1; transform: translateY(0); }

.card-info { padding: 25px; border-top: 1px solid #f1f5f9; }
.card-info .name { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 15px 0; height: 44px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.price-row { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 22px; font-weight: 900; color: #ef4444; }
</style>