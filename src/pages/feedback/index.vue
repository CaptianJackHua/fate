<template>
  <view class="feedback-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">评价反馈</text>
      <text class="page-subtitle">您的反馈将帮助我们改进算法</text>
    </view>
    
    <!-- 评分区域 -->
    <view class="rating-section card">
      <text class="section-title">准确度评分</text>
      <view class="rating-stars">
        <text 
          v-for="star in 5" 
          :key="star"
          class="star"
          :class="{ 'active': star <= rating }"
          @click="setRating(star)"
        >
          ★
        </text>
      </view>
      <text class="rating-text">{{ ratingText }}</text>
    </view>
    
    <!-- 准确度选择 -->
    <view class="accuracy-section card">
      <text class="section-title">结果是否准确？</text>
      <view class="accuracy-options">
        <view 
          class="accuracy-option"
          :class="{ 'active': isAccurate === true }"
          @click="setAccuracy(true)"
        >
          <text class="option-icon">✓</text>
          <text class="option-text">准确</text>
        </view>
        <view 
          class="accuracy-option"
          :class="{ 'active': isAccurate === false }"
          @click="setAccuracy(false)"
        >
          <text class="option-icon">✗</text>
          <text class="option-text">不准确</text>
        </view>
        <view 
          class="accuracy-option"
          :class="{ 'active': isAccurate === null }"
          @click="setAccuracy(null)"
        >
          <text class="option-icon">?</text>
          <text class="option-text">待定</text>
        </view>
      </view>
    </view>
    
    <!-- 标签选择 -->
    <view class="tags-section card">
      <text class="section-title">问题标签（多选）</text>
      <view class="tags-list">
        <text 
          v-for="tag in feedbackTags" 
          :key="tag"
          class="tag-item"
          :class="{ 'active': selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </text>
      </view>
    </view>
    
    <!-- 详细反馈 -->
    <view class="detail-section card">
      <text class="section-title">详细反馈（可选）</text>
      <textarea 
        v-model="feedbackDetail"
        placeholder="请详细描述您的反馈，帮助我们改进算法..."
        class="feedback-textarea"
        maxlength="500"
      />
      <text class="char-count">{{ feedbackDetail.length }}/500</text>
    </view>
    
    <!-- 提交按钮 -->
    <view class="action-section">
      <TraditionalButton 
        type="primary" 
        size="large"
        @click="submitFeedback"
        :disabled="!canSubmit"
      >
        提交反馈
      </TraditionalButton>
      
      <text class="action-tip">您的反馈对我们非常重要，感谢支持！</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 评分
const rating = ref(0)
const isAccurate = ref(null)
const selectedTags = ref([])
const feedbackDetail = ref('')

// 反馈标签
const feedbackTags = [
  '性格分析准确',
  '事业建议有用',
  '感情预测准确',
  '健康提醒及时',
  '大运走势准确',
  '卦象解读清晰',
  '建议实用',
  '整体满意',
  '需要改进',
  '其他问题'
]

// 评分文字
const ratingText = computed(() => {
  const texts = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
  return texts[rating.value] || '请点击星星评分'
})

// 是否可以提交
const canSubmit = computed(() => {
  return rating.value > 0
})

// 设置评分
const setRating = (value) => {
  rating.value = value
}

// 设置准确度
const setAccuracy = (value) => {
  isAccurate.value = value
}

// 切换标签
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 提交反馈
const submitFeedback = () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请先评分',
      icon: 'none'
    })
    return
  }
  
  // 构建反馈数据
  const feedbackData = {
    rating: rating.value,
    isAccurate: isAccurate.value,
    tags: selectedTags.value,
    feedback: feedbackDetail.value,
    timestamp: Date.now()
  }
  
  // 保存到本地存储
  const feedbacks = uni.getStorageSync('userFeedbacks') || []
  feedbacks.push(feedbackData)
  uni.setStorageSync('userFeedbacks', feedbacks)
  
  // 显示成功提示
  uni.showToast({
    title: '反馈提交成功',
    icon: 'success',
    duration: 2000
  })
  
  // 延迟返回
  setTimeout(() => {
    uni.navigateBack()
  }, 2000)
}
</script>

<style lang="scss" scoped>
.feedback-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 40rpx;
}

// 页面标题
.page-header {
  text-align: center;
  margin-bottom: 48rpx;
  
  .page-title {
    display: block;
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $primary;
    font-family: 'Noto Serif SC', serif;
    margin-bottom: 16rpx;
  }
  
  .page-subtitle {
    display: block;
    font-size: $font-size-md;
    color: $text-secondary;
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

// 区块标题
.section-title {
  display: block;
  font-size: $font-size-md;
  font-weight: 600;
  color: $primary;
  margin-bottom: 24rpx;
  font-family: 'Noto Serif SC', serif;
}

// 评分区域
.rating-section {
  text-align: center;
  
  .rating-stars {
    display: flex;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
    
    .star {
      font-size: 60rpx;
      color: $bg-secondary;
      transition: $transition-fast;
      cursor: pointer;
      
      &.active {
        color: #ffd700;
      }
      
      &:active {
        transform: scale(1.2);
      }
    }
  }
  
  .rating-text {
    display: block;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

// 准确度选择
.accuracy-section {
  .accuracy-options {
    display: flex;
    gap: 16rpx;
    
    .accuracy-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx 16rpx;
      background: $bg-secondary;
      border-radius: $border-radius-md;
      border: 2rpx solid rgba($secondary, 0.3);
      transition: $transition-fast;
      
      &.active {
        border-color: $accent;
        background: rgba($accent, 0.1);
      }
      
      .option-icon {
        font-size: 36rpx;
        margin-bottom: 8rpx;
      }
      
      .option-text {
        font-size: $font-size-sm;
        color: $text-primary;
      }
    }
  }
}

// 标签选择
.tags-section {
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .tag-item {
      padding: 12rpx 20rpx;
      background: $bg-secondary;
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

// 详细反馈
.detail-section {
  .feedback-textarea {
    width: 100%;
    height: 200rpx;
    padding: 24rpx;
    background: $bg-secondary;
    border: 2rpx solid rgba($secondary, 0.3);
    border-radius: $border-radius-md;
    font-size: $font-size-md;
    color: $text-primary;
    margin-bottom: 8rpx;
  }
  
  .char-count {
    display: block;
    text-align: right;
    font-size: $font-size-xs;
    color: $text-secondary;
  }
}

// 操作区域
.action-section {
  text-align: center;
  padding: 24rpx 0;
  
  .action-tip {
    display: block;
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-top: 16rpx;
  }
}
</style>
