<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <image 
          v-if="userInfo.avatarUrl" 
          :src="userInfo.avatarUrl" 
          class="avatar-image"
        />
        <view v-else class="avatar-placeholder">
          <text class="avatar-text">{{ getAvatarText() }}</text>
        </view>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo.nickName || '未登录' }}</text>
        <text class="user-level" v-if="userInfo.vipLevel > 0">VIP{{ userInfo.vipLevel }}</text>
      </view>
      <view class="login-btn" v-if="!isLoggedIn">
        <TraditionalButton 
          type="primary" 
          size="small"
          @click="handleLogin"
        >
          微信登录
        </TraditionalButton>
      </view>
    </view>
    
    <!-- 统计信息 -->
    <view class="stats-section card">
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ stats.bazi }}</text>
          <text class="stat-label">八字排盘</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ stats.liuyao }}</text>
          <text class="stat-label">六爻占卜</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ stats.total }}</text>
          <text class="stat-label">总计</text>
        </view>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section card">
      <view class="menu-list">
        <view class="menu-item" @click="navigateToHistory">
          <view class="menu-icon">📜</view>
          <text class="menu-text">测算历史</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="navigateToFeedback">
          <view class="menu-icon">💬</view>
          <text class="menu-text">我的反馈</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="showSettings">
          <view class="menu-icon">⚙️</view>
          <text class="menu-text">设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="showAbout">
          <view class="menu-icon">ℹ️</view>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-section" v-if="isLoggedIn">
      <text class="logout-btn" @click="handleLogout">退出登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const userInfo = ref({})
const isLoggedIn = ref(false)
const stats = ref({
  bazi: 0,
  liuyao: 0,
  total: 0
})

onMounted(() => {
  checkLoginStatus()
  loadStats()
})

// 检查登录状态
const checkLoginStatus = () => {
  const user = uni.getStorageSync('userInfo')
  if (user) {
    userInfo.value = user
    isLoggedIn.value = true
  }
}

// 加载统计数据
const loadStats = () => {
  const baziHistory = uni.getStorageSync('baziHistory') || []
  const liuyaoRecords = uni.getStorageSync('liuyaoRecords') || []
  
  stats.value = {
    bazi: baziHistory.length,
    liuyao: liuyaoRecords.length,
    total: baziHistory.length + liuyaoRecords.length
  }
}

// 获取头像文字
const getAvatarText = () => {
  const name = userInfo.value.nickName || '用户'
  return name.charAt(0).toUpperCase()
}

// 微信登录
const handleLogin = () => {
  uni.showLoading({ title: '登录中...' })
  
  // 调用微信登录
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      // 获取用户信息
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (profileRes) => {
          const userData = {
            ...profileRes.userInfo,
            loginTime: Date.now()
          }
          
          // 保存用户信息
          uni.setStorageSync('userInfo', userData)
          userInfo.value = userData
          isLoggedIn.value = true
          
          uni.hideLoading()
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
        }
      })
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        uni.removeStorageSync('userInfo')
        userInfo.value = {}
        isLoggedIn.value = false
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

// 导航到历史记录
const navigateToHistory = () => {
  uni.switchTab({
    url: '/pages/history/index'
  })
}

// 导航到反馈
const navigateToFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/index'
  })
}

// 显示设置
const showSettings = () => {
  uni.showToast({
    title: '设置功能开发中',
    icon: 'none'
  })
}

// 显示关于
const showAbout = () => {
  uni.showModal({
    title: '关于文墨天机',
    content: '文墨天机是一款专业的命理测算小程序，提供八字排盘、六爻占卜等功能。传承千年智慧，洞察命运玄机。',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 40rpx;
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
  border-radius: $border-radius-lg;
  padding: 48rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $shadow-lg;
  
  .user-avatar {
    .avatar-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(white, 0.3);
    }
    
    .avatar-placeholder {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: rgba(white, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4rpx solid rgba(white, 0.3);
      
      .avatar-text {
        font-size: 48rpx;
        color: white;
        font-weight: 700;
      }
    }
  }
  
  .user-info {
    flex: 1;
    
    .user-name {
      display: block;
      font-size: $font-size-xl;
      font-weight: 600;
      color: white;
      margin-bottom: 8rpx;
    }
    
    .user-level {
      display: inline-block;
      font-size: $font-size-xs;
      color: $accent-light;
      background: rgba($accent, 0.3);
      padding: 4rpx 12rpx;
      border-radius: $border-radius-sm;
    }
  }
  
  .login-btn {
    // 登录按钮样式
  }
}

// 卡片样式
.card {
  background: white;
  border-radius: $border-radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-sm;
  border: 2rpx solid rgba($accent, 0.2);
}

// 统计信息
.stats-section {
  .stats-grid {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: $font-size-xxl;
        font-weight: 700;
        color: $primary;
        margin-bottom: 8rpx;
      }
      
      .stat-label {
        display: block;
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}

// 菜单区域
.menu-section {
  .menu-list {
    .menu-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid rgba($secondary, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background: rgba($accent, 0.05);
      }
      
      .menu-icon {
        width: 48rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        margin-right: 16rpx;
      }
      
      .menu-text {
        flex: 1;
        font-size: $font-size-md;
        color: $text-primary;
      }
      
      .menu-arrow {
        font-size: $font-size-lg;
        color: $text-secondary;
      }
    }
  }
}

// 退出登录
.logout-section {
  text-align: center;
  padding: 24rpx 0;
  
  .logout-btn {
    font-size: $font-size-md;
    color: $fire-color;
    padding: 16rpx 32rpx;
    border: 1rpx solid rgba($fire-color, 0.3);
    border-radius: $border-radius-md;
  }
}
</style>
