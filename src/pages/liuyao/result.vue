<template>
  <view class="liuyao-result-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-section">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在解卦...</text>
    </view>
    
    <!-- 卦象结果 -->
    <view v-else class="result-content">
      <!-- 本卦信息 -->
      <view class="gua-info card">
        <view class="gua-header">
          <text class="gua-name">{{ guaData.benGua?.name }}卦</text>
          <text class="gua-symbol">{{ guaData.benGua?.symbol }}</text>
        </view>
        <view class="gua-detail">
          <text class="gua-description">{{ guaData.benGua?.description }}</text>
          <text class="gua-meaning">{{ guaData.benGua?.meaning }}</text>
        </view>
      </view>
      
      <!-- 卦象展示 -->
      <view class="gua-display card">
        <text class="section-title">卦象</text>
        <view class="yao-container">
          <view 
            v-for="(yao, index) in guaData.benGua?.yao" 
            :key="index"
            class="yao-item"
            :class="{ 
              'yang': yao.value === 1, 
              'yin': yao.value === 0,
              'moving': yao.isMoving 
            }"
          >
            <view class="yao-line">
              <view v-if="yao.value === 1" class="yang-line"></view>
              <view v-else class="yin-line">
                <view class="yin-part left"></view>
                <view class="yin-part right"></view>
              </view>
            </view>
            <text v-if="yao.isMoving" class="moving-mark">动</text>
          </view>
        </view>
      </view>
      
      <!-- 变卦信息 -->
      <view class="bian-gua card" v-if="guaData.bianGua">
        <text class="section-title">变卦</text>
        <view class="bian-gua-info">
          <text class="bian-gua-name">{{ guaData.bianGua.name }}卦</text>
          <view class="bian-yao-container">
            <view 
              v-for="(yao, index) in guaData.bianGua.yao" 
              :key="index"
              class="yao-item small"
              :class="{ 'yang': yao.value === 1, 'yin': yao.value === 0 }"
            >
              <view class="yao-line">
                <view v-if="yao.value === 1" class="yang-line"></view>
                <view v-else class="yin-line">
                  <view class="yin-part left"></view>
                  <view class="yin-part right"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 动爻信息 -->
      <view class="dong-yao card" v-if="guaData.dongYao?.position > 0">
        <text class="section-title">动爻</text>
        <view class="dong-yao-info">
          <text class="dong-yao-position">第 {{ guaData.dongYao.position }} 爻</text>
          <text class="dong-yao-ci">{{ guaData.dongYao.yaoCi }}</text>
          <text class="dong-yao-meaning">{{ guaData.dongYao.meaning }}</text>
        </view>
      </view>
      
      <!-- 卦辞解读 -->
      <view class="interpretation card">
        <text class="section-title">卦辞解读</text>
        <view class="interpretation-content">
          <view class="interpretation-item">
            <text class="item-title">总体判断</text>
            <text class="item-text">{{ guaData.interpretation?.overall }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">建议</text>
            <text class="item-text">{{ guaData.interpretation?.advice }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">时机</text>
            <text class="item-text">{{ guaData.interpretation?.time }}</text>
          </view>
          <view class="interpretation-item">
            <text class="item-title">方位</text>
            <text class="item-text">{{ guaData.interpretation?.direction }}</text>
          </view>
        </view>
      </view>
      
      <!-- 具体建议 -->
      <view class="advice card" v-if="selectedType">
        <text class="section-title">{{ selectedType }}建议</text>
        <text class="advice-text">{{ specificAdvice }}</text>
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
import { getAdviceByQuestionType } from '@/utils/liuyaoCalculator.js'
import Disclaimer from '@/components/Disclaimer/index.vue'

const loading = ref(true)
const guaData = ref({})
const selectedType = ref('')
const specificAdvice = ref('')

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { data } = currentPage.options
  
  if (data) {
    try {
      guaData.value = JSON.parse(decodeURIComponent(data))
      
      // 获取问题类型
      const records = uni.getStorageSync('liuyaoRecords') || []
      const lastRecord = records[0]
      if (lastRecord) {
        selectedType.value = lastRecord.questionType
        specificAdvice.value = getAdviceByQuestionType(selectedType.value, guaData.value)
      }
      
      // 保存到最近测算记录
      saveRecentCalculation()
    } catch (error) {
      console.error('解析卦象数据错误:', error)
    }
  }
  
  // 模拟加载
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

// 保存到最近测算记录
const saveRecentCalculation = () => {
  const records = uni.getStorageSync('recentCalculations') || []
  const newRecord = {
    id: Date.now().toString(),
    type: 'liuyao',
    time: Date.now(),
    summary: `${guaData.value.benGua?.name}卦 - ${guaData.value.benGua?.meaning}`
  }
  
  records.unshift(newRecord)
  const limited = records.slice(0, 10)
  uni.setStorageSync('recentCalculations', limited)
}

// 显示反馈
const showFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/index?type=liuyao'
  })
}
</script>

<style lang="scss" scoped>
.liuyao-result-page {
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

// 本卦信息
.gua-info {
  .gua-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .gua-name {
      font-size: $font-size-xl;
      font-weight: 700;
      color: $primary;
      font-family: 'Noto Serif SC', serif;
    }
    
    .gua-symbol {
      font-size: 60rpx;
      color: $accent;
    }
  }
  
  .gua-detail {
    .gua-description {
      display: block;
      font-size: $font-size-md;
      color: $primary;
      margin-bottom: 8rpx;
      font-weight: 600;
    }
    
    .gua-meaning {
      display: block;
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

// 卦象展示
.gua-display {
  .yao-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
  }
  
  .yao-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    
    &.small {
      .yang-line,
      .yin-line {
        width: 120rpx;
        height: 8rpx;
      }
      
      .yin-part {
        width: 52rpx;
        height: 8rpx;
      }
    }
    
    .yao-line {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .yang-line {
        width: 200rpx;
        height: 12rpx;
        background: $primary;
        border-radius: 6rpx;
      }
      
      .yin-line {
        display: flex;
        gap: 16rpx;
        
        .yin-part {
          width: 88rpx;
          height: 12rpx;
          background: $primary;
          border-radius: 6rpx;
        }
      }
    }
    
    .moving-mark {
      font-size: $font-size-sm;
      color: $fire-color;
      font-weight: 600;
      padding: 4rpx 12rpx;
      background: rgba($fire-color, 0.1);
      border-radius: $border-radius-sm;
    }
  }
}

// 变卦
.bian-gua {
  .bian-gua-info {
    display: flex;
    align-items: center;
    gap: 24rpx;
    
    .bian-gua-name {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $primary;
      font-family: 'Noto Serif SC', serif;
    }
    
    .bian-yao-container {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
    }
  }
}

// 动爻
.dong-yao {
  .dong-yao-info {
    .dong-yao-position {
      display: block;
      font-size: $font-size-md;
      font-weight: 600;
      color: $primary;
      margin-bottom: 8rpx;
    }
    
    .dong-yao-ci {
      display: block;
      font-size: $font-size-md;
      color: $text-accent;
      margin-bottom: 8rpx;
      font-style: italic;
    }
    
    .dong-yao-meaning {
      display: block;
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

// 卦辞解读
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

// 具体建议
.advice {
  .advice-text {
    display: block;
    font-size: $font-size-md;
    color: $text-primary;
    line-height: 1.6;
    padding: 16rpx;
    background: rgba($accent, 0.05);
    border-radius: $border-radius-md;
    border-left: 4rpx solid $accent;
  }
}

// 反馈区域
.feedback-section {
  text-align: center;
  padding: 24rpx 0;
}
</style>
