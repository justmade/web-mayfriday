import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 认证状态管理
 * Authentication state management store
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      token: null,
      phone: null,
      isLoggedIn: false,

      /**
       * 登录
       * Login with token and phone
       */
      login: (token, phone) => {
        set({
          token,
          phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), // 脱敏显示 / Mask phone
          isLoggedIn: true
        })
      },

      /**
       * 退出登录
       * Logout and clear session
       */
      logout: async () => {
        const { token } = get()

        // 可选：调用API通知服务器删除令牌
        // Optional: Call API to notify server to delete token
        if (token) {
          try {
            await fetch('/api/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
          } catch (err) {
            console.error('Logout API call failed:', err)
          }
        }

        set({ token: null, phone: null, isLoggedIn: false })
      },

      /**
       * 检查登录状态
       * Check if user is authenticated and token is valid
       */
      checkAuth: () => {
        const { token } = get()

        if (!token) {
          set({ isLoggedIn: false })
          return false
        }

        // 验证JWT是否过期（前端简单检查）
        // Verify JWT expiration (simple client-side check)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const isExpired = payload.exp * 1000 < Date.now()

          if (isExpired) {
            set({ token: null, phone: null, isLoggedIn: false })
            return false
          }

          set({ isLoggedIn: true })
          return true
        } catch (err) {
          console.error('Token validation error:', err)
          set({ token: null, phone: null, isLoggedIn: false })
          return false
        }
      },

      /**
       * 获取认证令牌
       * Get authentication token
       */
      getToken: () => {
        return get().token
      },

      /**
       * 获取手机号（脱敏）
       * Get masked phone number
       */
      getPhone: () => {
        return get().phone
      }
    }),
    {
      name: 'auth-storage', // LocalStorage key
      partialize: (state) => ({
        token: state.token,
        phone: state.phone,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)

export default useAuthStore
