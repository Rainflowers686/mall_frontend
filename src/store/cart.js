import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // 购物车里的商品列表
  }),
  getters: {
    // 计算总价（对标任务书：实时价格计算）
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    }
  },
  actions: {
    // 从后端同步购物车数据
    async fetchCart() {
      // 这里的逻辑我们会对接你 router.register(r'api/cart', ...) 那个接口
    }
  }
})