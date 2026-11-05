<template>
  <view class="index-page">
    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <view class="ink-wash-top"></view>
    </view>
    
    <!-- 八卦图 -->
    <view class="bagua-section">
      <BaguaDiagram :animated="true" />
    </view>
    
    <!-- 欢迎语 -->
    <view class="welcome-section">
      <text class="welcome-title">文墨天机</text>
      <text class="welcome-subtitle">传承千年智慧 · 洞察命运玄机</text>
    </view>
    
    <!-- 功能入口 -->
    <view class="function-section">
      <view class="function-grid">
        <view 
          class="function-card"
          @click="navigateToBazi"
        >
          <view class="card-icon bazi-icon">☰</view>
          <text class="card-title">八字排盘</text>
          <text class="card-desc">四柱八字 · 命理分析</text>
        </view>
        
        <view 
          class="function-card"
          @click="navigateToLiuyao"
        >
          <view class="card-icon liuyao-icon">⚊</view>
          <text class="card-title">六爻占卜</text>
          <text class="card-desc">周易起卦 · 预测吉凶</text>
        </view>
      </view>
    </view>
    
    <!-- 最近测算 -->
    <view class="recent-section" v-if="recentCalculations.length > 0">
      <view class="section-header">
        <text class="section-title">最近测算</text>
        <text class="section-more" @click="navigateToHistory">查看更多</text>
      </view>
      
      <view class="recent-list">
        <view 
          v-for="(item, index) in recentCalculations" 
          :key="index"
          class="recent-item"
          @click="viewCalculation(item)"
        >
          <view class="item-info">
            <text class="item-type">{{ item.type === 'bazi' ? '八字排盘' : '六爻占卜' }}</text>
            <text class="item-time">{{ formatTime(item.time) }}</text>
          </view>
          <text class="item-result">{{ item.summary }}</text>
        </view>
      </view>
    </view>

    <!-- 免责声明 -->
    <Disclaimer />

    <!-- 底部装饰 -->
    <view class="footer-decoration">
      <view class="ink-wash-bottom"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Disclaimer from '@/components/Disclaimer/index.vue'

const recentCalculations = ref([])

onMounted(() => {
  loadRecentCalculations()
})

// 加载最近测算记录
const loadRecentCalculations = () => {
  // 从本地存储获取最近测算记录
  const records = uni.getStorageSync('recentCalculations') || []
  recentCalculations.value = records.slice(0, 3)
}

// 跳转到八字排盘
const navigateToBazi = () => {
  uni.navigateTo({
    url: '/pages/bazi/input'
  })
}

// 跳转到六爻占卜
const navigateToLiuyao = () => {
  uni.navigateTo({
    url: '/pages/liuyao/divination'
  })
}

// 跳转到历史记录
const navigateToHistory = () => {
  uni.switchTab({
    url: '/pages/history/index'
  })
}

// 查看测算详情
const viewCalculation = (item) => {
  const url = item.type === 'bazi' 
    ? `/pages/bazi/result?id=${item.id}`
    : `/pages/liuyao/result?id=${item.id}`
  uni.navigateTo({ url })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: $bg-primary;
  position: relative;
  overflow: hidden;
}

// 顶部水墨装饰
.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  overflow: hidden;
  
  .ink-wash-top {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba($primary, 0.1) 0%,
      rgba($primary, 0.05) 50%,
      transparent 100%
    );
  }
}

// 八卦区域
.bagua-section {
  display: flex;
  justify-content: center;
  padding-top: 60rpx;
  padding-bottom: 40rpx;
}

// 欢迎语
.welcome-section {
  text-align: center;
  padding: 0 40rpx;
  margin-bottom: 60rpx;
  
  .welcome-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: $primary;
    font-family: 'Noto Serif SC', serif;
    margin-bottom: 16rpx;
    letter-spacing: 8rpx;
  }
  
  .welcome-subtitle {
    display: block;
    font-size: $font-size-sm;
    color: $text-secondary;
    letter-spacing: 4rpx;
  }
}

// 功能入口
.function-section {
  padding: 0 40rpx;
  margin-bottom: 60rpx;
  
  .function-grid {
    display: flex;
    gap: 24rpx;
  }
  
  .function-card {
    flex: 1;
    background: white;
    border-radius: $border-radius-lg;
    padding: 40rpx 24rpx;
    text-align: center;
    box-shadow: $shadow-md;
    border: 2rpx solid rgba($accent, 0.2);
    transition: $transition-normal;
    
    &:active {
      transform: scale(0.98);
      box-shadow: $shadow-sm;
    }
    
    .card-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20rpx;
      font-size: 40rpx;
      
      &.bazi-icon {
        background: linear-gradient(135deg, rgba($wood-color, 0.2), rgba($wood-color, 0.1));
        color: $wood-color;
      }
      
      &.liuyao-icon {
        background: linear-gradient(135deg, rgba($fire-color, 0.2), rgba($fire-color, 0.1));
        color: $fire-color;
      }
    }
    
    .card-title {
      display: block;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $primary;
      margin-bottom: 8rpx;
      font-family: 'Noto Serif SC', serif;
    }
    
    .card-desc {
      display: block;
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
}

// 最近测算
.recent-section {
  padding: 0 40rpx;
  margin-bottom: 60rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $primary;
      font-family: 'Noto Serif SC', serif;
    }
    
    .section-more {
      font-size: $font-size-sm;
      color: $accent;
    }
  }
  
  .recent-list {
    .recent-item {
      background: white;
      border-radius: $border-radius-md;
      padding: 24rpx;
      margin-bottom: 16rpx;
      box-shadow: $shadow-sm;
      border: 2rpx solid rgba($accent, 0.1);
      
      .item-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8rpx;
        
        .item-type {
          font-size: $font-size-md;
          font-weight: 600;
          color: $primary;
        }
        
        .item-time {
          font-size: $font-size-xs;
          color: $text-secondary;
        }
      }
      
      .item-result {
        font-size: $font-size-sm;
        color: $text-secondary;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

// 底部装饰
.footer-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150rpx;
  overflow: hidden;
  
  .ink-wash-bottom {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba($primary, 0.08) 0%,
      rgba($primary, 0.03) 50%,
      transparent 100%
    );
  }
}
</style>
