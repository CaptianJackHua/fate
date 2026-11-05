<template>
  <view class="bazi-result-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-section">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在排盘...</text>
    </view>
    
    <!-- 排盘结果 -->
    <view v-else class="result-content">
      <!-- 基本信息 -->
      <view class="basic-info card">
        <view class="info-header">
          <text class="info-title">命盘信息</text>
          <text class="info-date">{{ baziData.meta?.birthDate }}</text>
        </view>
        <view class="info-detail">
          <text class="detail-item">日主：{{ baziData.meta?.dayMaster }}</text>
          <text class="detail-item">五行：{{ baziData.meta?.dayMasterWuXing }}命</text>
          <text class="detail-item">性别：{{ baziData.meta?.gender }}</text>
        </view>
      </view>
      
      <!-- 四柱八字 -->
      <view class="bazi-pillar card">
        <text class="section-title">四柱八字</text>
        <view class="pillar-grid">
          <view class="pillar-header">
            <text class="header-item">年柱</text>
            <text class="header-item">月柱</text>
            <text class="header-item">日柱</text>
            <text class="header-item">时柱</text>
          </view>
          <view class="pillar-row">
            <text 
              v-for="(pillar, key) in baziData.bazi" 
              :key="key"
              class="pillar-gan"
              :class="getWuXingClass(pillar.gan)"
            >
              {{ pillar.gan }}
            </text>
          </view>
          <view class="pillar-row">
            <text 
              v-for="(pillar, key) in baziData.bazi" 
              :key="key"
              class="pillar-zhi"
              :class="getWuXingClass(pillar.zhi)"
            >
              {{ pillar.zhi }}
            </text>
          </view>
        </view>
      </view>
      
      <!-- 十神分析 -->
      <view class="shishen-analysis card">
        <text class="section-title">十神分析</text>
        <view class="shishen-grid">
          <view class="shishen-row">
            <text class="shishen-label">年柱</text>
            <text class="shishen-value">{{ baziData.shiShen?.year.gan }} / {{ baziData.shiShen?.year.zhi }}</text>
          </view>
          <view class="shishen-row">
            <text class="shishen-label">月柱</text>
            <text class="shishen-value">{{ baziData.shiShen?.month.gan }} / {{ baziData.shiShen?.month.zhi }}</text>
          </view>
          <view class="shishen-row">
            <text class="shishen-label">日柱</text>
            <text class="shishen-value">{{ baziData.shiShen?.day.gan }} / {{ baziData.shiShen?.day.zhi }}</text>
          </view>
          <view class="shishen-row">
            <text class="shishen-label">时柱</text>
            <text class="shishen-value">{{ baziData.shiShen?.hour.gan }} / {{ baziData.shiShen?.hour.zhi }}</text>
          </view>
        </view>
      </view>
      
      <!-- 五行分析 -->
      <view class="wuxing-analysis card">
        <text class="section-title">五行分析</text>
        <view class="wuxing-chart">
          <view 
            v-for="(count, element) in baziData.wuXing?.count" 
            :key="element"
            class="wuxing-item"
          >
            <text class="wuxing-name" :class="getWuXingColorClass(element)">{{ element }}</text>
            <view class="wuxing-bar">
              <view 
                class="wuxing-fill"
                :class="getWuXingColorClass(element)"
                :style="{ width: (count / 8 * 100) + '%' }"
              ></view>
            </view>
            <text class="wuxing-count">{{ count }}</text>
          </view>
        </view>
        <view class="wuxing-summary">
          <text class="summary-text">最旺：{{ baziData.wuXing?.strongest }} | 最弱：{{ baziData.wuXing?.weakest }}</text>
          <text class="summary-text">日主{{ baziData.wuXing?.isWang ? '身旺' : '身弱' }}</text>
        </view>
      </view>
      
      <!-- 大运 -->
      <view class="dayun-section card">
        <text class="section-title">大运走势</text>
        <view class="dayun-list">
          <view 
            v-for="(yun, index) in baziData.daYun" 
            :key="index"
            class="dayun-item"
            :class="{ 'current': index === 0 }"
          >
            <text class="dayun-age">{{ yun.age }}岁</text>
            <text class="dayun-ganzhi">{{ yun.ganZhi }}</text>
            <text class="dayun-shishen">{{ yun.shiShen }}</text>
          </view>
        </view>
      </view>
      
      <!-- 命理解读 -->
      <view class="interpretation card">
        <text class="section-title">命理解读</text>
        <view class="interpretation-content">
          <view class="interpretation-item">
            <text class="item-title">总论</text>
            <text class="item-text">{{ baziData.interpretation?.summary }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">性格</text>
            <text class="item-text">{{ baziData.interpretation?.personality }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">事业</text>
            <text class="item-text">{{ baziData.interpretation?.career }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">婚姻</text>
            <text class="item-text">{{ baziData.interpretation?.marriage }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">健康</text>
            <text class="item-text">{{ baziData.interpretation?.health }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">大运</text>
            <text class="item-text">{{ baziData.interpretation?.daYun }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">建议</text>
            <text class="item-text">{{ baziData.interpretation?.advice }}</text>
          </view>
        </view>
      </view>
      
      <!-- 反馈按钮 -->
      <view class="feedback-section">
        <TraditionalButton 
          type="secondary" 
          size="medium"
          @click="showFeedback"
        >
          评价准确度
        </TraditionalButton>
      </view>

      <!-- 免责声明 -->
      <Disclaimer />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { calculateBaZi } from '@/utils/baziCalculator.js'
import Disclaimer from '@/components/Disclaimer/index.vue'

const loading = ref(true)
const baziData = ref({})

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { year, month, day, hour, gender } = currentPage.options
  
  // 计算八字
  calculateBaziResult(Number(year), Number(month), Number(day), Number(hour), gender)
})

// 计算八字结果
const calculateBaziResult = (year, month, day, hour, gender) => {
  loading.value = true
  
  // 模拟异步计算
  setTimeout(() => {
    try {
      const result = calculateBaZi(year, month, day, hour, gender)
      baziData.value = result
      
      // 保存到最近测算记录
      saveRecentCalculation(result)
    } catch (error) {
      console.error('八字计算错误:', error)
      uni.showToast({
        title: '计算出错，请重试',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }, 1500)
}

// 保存到最近测算记录
const saveRecentCalculation = (result) => {
  const records = uni.getStorageSync('recentCalculations') || []
  const newRecord = {
    id: Date.now().toString(),
    type: 'bazi',
    time: Date.now(),
    summary: result.interpretation?.summary || '八字排盘结果'
  }
  
  records.unshift(newRecord)
  const limited = records.slice(0, 10)
  uni.setStorageSync('recentCalculations', limited)
}

// 获取五行样式类
const getWuXingClass = (character) => {
  const wuXingMap = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water',
    '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
    '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
    '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water'
  }
  return wuXingMap[character] || ''
}

// 获取五行颜色样式类
const getWuXingColorClass = (element) => {
  const colorMap = {
    '金': 'metal',
    '木': 'wood',
    '水': 'water',
    '火': 'fire',
    '土': 'earth'
  }
  return colorMap[element] || ''
}

// 显示反馈
const showFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/index?type=bazi'
  })
}
</script>

<style lang="scss" scoped>
.bazi-result-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 40rpx;
}

// 加载状态
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  
  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 4rpx solid rgba($accent, 0.3);
    border-top-color: $accent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24rpx;
  }
  
  .loading-text {
    font-size: $font-size-md;
    color: $text-secondary;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

// 卡片样式
.card {
  background: white;
  border-radius: $border-radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-md;
  border: 2rpx solid rgba($accent, 0.2);
}

// 区块标题
.section-title {
  display: block;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $primary;
  margin-bottom: 24rpx;
  font-family: 'Noto Serif SC', serif;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid rgba($accent, 0.2);
}

// 基本信息
.basic-info {
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .info-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $primary;
      font-family: 'Noto Serif SC', serif;
    }
    
    .info-date {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  .info-detail {
    display: flex;
    gap: 24rpx;
    
    .detail-item {
      font-size: $font-size-sm;
      color: $text-secondary;
      background: $bg-secondary;
      padding: 8rpx 16rpx;
      border-radius: $border-radius-sm;
    }
  }
}

// 四柱八字
.bazi-pillar {
  .pillar-grid {
    .pillar-header {
      display: flex;
      justify-content: space-around;
      margin-bottom: 16rpx;
      
      .header-item {
        font-size: $font-size-sm;
        color: $text-secondary;
        font-weight: 600;
      }
    }
    
    .pillar-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 8rpx;
      
      .pillar-gan,
      .pillar-zhi {
        font-size: 40rpx;
        font-weight: 700;
        width: 80rpx;
        text-align: center;
        padding: 12rpx;
        border-radius: $border-radius-sm;
        
        &.wood { color: $wood-color; background: rgba($wood-color, 0.1); }
        &.fire { color: $fire-color; background: rgba($fire-color, 0.1); }
        &.earth { color: $earth-color; background: rgba($earth-color, 0.1); }
        &.metal { color: $metal-color; background: rgba($metal-color, 0.1); }
        &.water { color: $water-color; background: rgba($water-color, 0.1); }
      }
    }
  }
}

// 十神分析
.shishen-analysis {
  .shishen-grid {
    .shishen-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12rpx 0;
      border-bottom: 1rpx solid rgba($secondary, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
      
      .shishen-label {
        font-size: $font-size-md;
        color: $text-secondary;
        font-weight: 600;
      }
      
      .shishen-value {
        font-size: $font-size-md;
        color: $primary;
      }
    }
  }
}

// 五行分析
.wuxing-analysis {
  .wuxing-chart {
    margin-bottom: 16rpx;
    
    .wuxing-item {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .wuxing-name {
        width: 60rpx;
        font-size: $font-size-md;
        font-weight: 600;
        text-align: center;
        
        &.metal { color: $metal-color; }
        &.wood { color: $wood-color; }
        &.water { color: $water-color; }
        &.fire { color: $fire-color; }
        &.earth { color: $earth-color; }
      }
      
      .wuxing-bar {
        flex: 1;
        height: 20rpx;
        background: $bg-secondary;
        border-radius: 10rpx;
        margin: 0 16rpx;
        overflow: hidden;
        
        .wuxing-fill {
          height: 100%;
          border-radius: 10rpx;
          transition: width 0.5s ease;
          
          &.metal { background: $metal-color; }
          &.wood { background: $wood-color; }
          &.water { background: $water-color; }
          &.fire { background: $fire-color; }
          &.earth { background: $earth-color; }
        }
      }
      
      .wuxing-count {
        width: 40rpx;
        font-size: $font-size-sm;
        color: $text-secondary;
        text-align: right;
      }
    }
  }
  
  .wuxing-summary {
    display: flex;
    justify-content: space-between;
    padding-top: 16rpx;
    border-top: 1rpx solid rgba($secondary, 0.1);
    
    .summary-text {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

// 大运
.dayun-section {
  .dayun-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .dayun-item {
      flex: 1;
      min-width: 120rpx;
      text-align: center;
      padding: 16rpx 8rpx;
      background: $bg-secondary;
      border-radius: $border-radius-md;
      border: 2rpx solid transparent;
      
      &.current {
        border-color: $accent;
        background: rgba($accent, 0.1);
      }
      
      .dayun-age {
        display: block;
        font-size: $font-size-xs;
        color: $text-secondary;
        margin-bottom: 4rpx;
      }
      
      .dayun-ganzhi {
        display: block;
        font-size: $font-size-md;
        font-weight: 600;
        color: $primary;
        margin-bottom: 4rpx;
      }
      
      .dayun-shishen {
        display: block;
        font-size: $font-size-xs;
        color: $accent;
      }
    }
  }
}

// 命理解读
.interpretation {
  .interpretation-content {
    .interpretation-item {
      margin-bottom: 20rpx;
      padding-bottom: 16rpx;
      border-bottom: 1rpx solid rgba($secondary, 0.1);
      
      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .item-title {
        display: block;
        font-size: $font-size-md;
        font-weight: 600;
        color: $primary;
        margin-bottom: 8rpx;
        font-family: 'Noto Serif SC', serif;
      }
      
      .item-text {
        display: block;
        font-size: $font-size-sm;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
}

// 反馈区域
.feedback-section {
  text-align: center;
  padding: 24rpx 0;
}
</style>
