<template>
  <view class="history-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">测算历史</text>
      <text class="page-subtitle">查看您的测算记录</text>
    </view>
    
    <!-- 筛选标签 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <text 
          v-for="tab in filterTabs" 
          :key="tab.value"
          class="filter-tab"
          :class="{ 'active': currentFilter === tab.value }"
          @click="setFilter(tab.value)"
        >
          {{ tab.label }}
        </text>
      </view>
    </view>
    
    <!-- 历史列表 -->
    <view class="history-list">
      <view 
        v-for="(item, index) in filteredHistory" 
        :key="index"
        class="history-item"
        @click="viewDetail(item)"
      >
        <view class="item-header">
          <view class="item-type">
            <text class="type-icon">{{ getTypeIcon(item.type) }}</text>
            <text class="type-name">{{ getTypeName(item.type) }}</text>
          </view>
          <text class="item-time">{{ formatTime(item.time) }}</text>
        </view>
        
        <view class="item-content">
          <text class="item-summary">{{ item.summary }}</text>
        </view>
        
        <view class="item-footer">
          <text class="item-method" v-if="item.method">{{ getMethodName(item.method) }}</text>
          <view class="item-rating" v-if="item.rating">
            <text 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ 'active': star <= item.rating }"
            >
              ★
            </text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="filteredHistory.length === 0" class="empty-state">
        <text class="empty-icon">📜</text>
        <text class="empty-text">暂无测算记录</text>
        <text class="empty-tip">快去体验一下八字排盘或六爻占卜吧</text>
      </view>
    </view>
    
    <!-- 清空按钮 -->
    <view class="clear-section" v-if="filteredHistory.length > 0">
      <text class="clear-btn" @click="clearHistory">清空历史记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 筛选标签
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '八字', value: 'bazi' },
  { label: '六爻', value: 'liuyao' }
]

const currentFilter = ref('all')
const historyList = ref([])

onMounted(() => {
  loadHistory()
})

// 加载历史记录
const loadHistory = () => {
  const records = uni.getStorageSync('recentCalculations') || []
  historyList.value = records
}

// 筛选后的历史记录
const filteredHistory = computed(() => {
  if (currentFilter.value === 'all') {
    return historyList.value
  }
  return historyList.value.filter(item => item.type === currentFilter.value)
})

// 设置筛选
const setFilter = (filter) => {
  currentFilter.value = filter
}

// 获取类型图标
const getTypeIcon = (type) => {
  const icons = {
    'bazi': '☰',
    'liuyao': '⚊'
  }
  return icons[type] || '?'
}

// 获取类型名称
const getTypeName = (type) => {
  const names = {
    'bazi': '八字排盘',
    'liuyao': '六爻占卜'
  }
  return names[type] || '未知'
}

// 获取方法名称
const getMethodName = (method) => {
  const names = {
    'number': '数字起卦',
    'coins': '铜钱摇卦',
    'time': '时间起卦',
    'random': '随机起卦'
  }
  return names[method] || ''
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`
  }
  
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 小于7天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }
  
  // 超过7天显示日期
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 查看详情
const viewDetail = (item) => {
  const url = item.type === 'bazi' 
    ? `/pages/bazi/result?id=${item.id}`
    : `/pages/liuyao/result?id=${item.id}`
  uni.navigateTo({ url })
}

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('recentCalculations')
        uni.removeStorageSync('baziHistory')
        uni.removeStorageSync('liuyaoRecords')
        historyList.value = []
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 40rpx;
}

// 页面标题
.page-header {
  text-align: center;
  margin-bottom: 32rpx;
  
  .page-title {
    display: block;
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $primary;
    font-family: 'Noto Serif SC', serif;
    margin-bottom: 8rpx;
  }
  
  .page-subtitle {
    display: block;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

// 筛选区域
.filter-section {
  margin-bottom: 24rpx;
  
  .filter-tabs {
    display: flex;
    gap: 16rpx;
    
    .filter-tab {
      padding: 12rpx 24rpx;
      background: white;
      border: 2rpx solid rgba($secondary, 0.3);
      border-radius: $border-radius-md;
      font-size: $font-size-sm;
      color: $text-secondary;
      transition: $transition-fast;
      
      &.active {
        border-color: $accent;
        background: rgba($accent, 0.1);
        color: $accent;
      }
    }
  }
}

// 历史列表
.history-list {
  .history-item {
    background: white;
    border-radius: $border-radius-lg;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: $shadow-sm;
    border: 2rpx solid rgba($accent, 0.1);
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;
      
      .item-type {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        .type-icon {
          font-size: 32rpx;
        }
        
        .type-name {
          font-size: $font-size-md;
          font-weight: 600;
          color: $primary;
        }
      }
      
      .item-time {
        font-size: $font-size-xs;
        color: $text-secondary;
      }
    }
    
    .item-content {
      margin-bottom: 12rpx;
      
      .item-summary {
        font-size: $font-size-sm;
        color: $text-secondary;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .item-method {
        font-size: $font-size-xs;
        color: $accent;
        background: rgba($accent, 0.1);
        padding: 4rpx 12rpx;
        border-radius: $border-radius-sm;
      }
      
      .item-rating {
        display: flex;
        gap: 4rpx;
        
        .star {
          font-size: 24rpx;
          color: $bg-secondary;
          
          &.active {
            color: #ffd700;
          }
        }
      }
    }
  }
  
  // 空状态
  .empty-state {
    text-align: center;
    padding: 80rpx 40rpx;
    
    .empty-icon {
      display: block;
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }
    
    .empty-text {
      display: block;
      font-size: $font-size-lg;
      color: $text-secondary;
      margin-bottom: 8rpx;
    }
    
    .empty-tip {
      display: block;
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

// 清空按钮
.clear-section {
  text-align: center;
  padding: 24rpx 0;
  
  .clear-btn {
    font-size: $font-size-sm;
    color: $text-secondary;
    padding: 12rpx 24rpx;
    border: 1rpx solid rgba($secondary, 0.3);
    border-radius: $border-radius-md;
  }
}
</style>
