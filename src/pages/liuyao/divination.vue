<template>
  <view class="liuyao-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">六爻占卜</text>
      <text class="page-subtitle">心诚则灵 · 遇事不决问六爻</text>
    </view>
    
    <!-- 占卜方式选择 -->
    <view class="method-section">
      <text class="section-title">选择起卦方式</text>
      <view class="method-grid">
        <view 
          class="method-card"
          :class="{ 'active': currentMethod === 'number' }"
          @click="selectMethod('number')"
        >
          <text class="method-icon">🔢</text>
          <text class="method-name">数字起卦</text>
          <text class="method-desc">输入三个数字</text>
        </view>
        
        <view 
          class="method-card"
          :class="{ 'active': currentMethod === 'coins' }"
          @click="selectMethod('coins')"
        >
          <text class="method-icon">🪙</text>
          <text class="method-name">铜钱摇卦</text>
          <text class="method-desc">模拟铜钱摇卦</text>
        </view>
        
        <view 
          class="method-card"
          :class="{ 'active': currentMethod === 'time' }"
          @click="selectMethod('time')"
        >
          <text class="method-icon">⏰</text>
          <text class="method-name">时间起卦</text>
          <text class="method-desc">以当前时间起卦</text>
        </view>
        
        <view 
          class="method-card"
          :class="{ 'active': currentMethod === 'random' }"
          @click="selectMethod('random')"
        >
          <text class="method-icon">🎲</text>
          <text class="method-name">随机起卦</text>
          <text class="method-desc">系统自动随机</text>
        </view>
      </view>
    </view>
    
    <!-- 数字起卦输入 -->
    <view v-if="currentMethod === 'number'" class="input-section">
      <view class="input-form">
        <view class="input-item">
          <text class="input-label">第一个数字</text>
          <input 
            type="number" 
            v-model="number1"
            placeholder="请输入1-999之间的数字"
            class="input-field"
          />
        </view>
        <view class="input-item">
          <text class="input-label">第二个数字</text>
          <input 
            type="number" 
            v-model="number2"
            placeholder="请输入1-999之间的数字"
            class="input-field"
          />
        </view>
        <view class="input-item">
          <text class="input-label">第三个数字</text>
          <input 
            type="number" 
            v-model="number3"
            placeholder="请输入1-999之间的数字"
            class="input-field"
          />
        </view>
      </view>
    </view>
    
    <!-- 铜钱摇卦 -->
    <view v-if="currentMethod === 'coins'" class="coins-section">
      <view class="coins-display">
        <view 
          v-for="(coin, index) in currentCoins" 
          :key="index"
          class="coin"
          :class="{ 'heads': coin === '正', 'tails': coin === '反' }"
          @click="flipCoin(index)"
        >
          <text class="coin-text">{{ coin === '正' ? '正' : '反' }}</text>
        </view>
      </view>
      <text class="coins-tip">点击铜钱翻转，摇出卦象</text>
      <view class="yao-progress">
        <text class="progress-text">第 {{ currentYao }}/6 爻</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: (currentYao / 6 * 100) + '%' }"></view>
        </view>
      </view>
    </view>
    
    <!-- 占卜问题 -->
    <view class="question-section">
      <text class="section-title">占卜问题（可选）</text>
      <textarea 
        v-model="question"
        placeholder="请简要描述您想要占卜的问题..."
        class="question-input"
        maxlength="100"
      />
      <view class="question-types">
        <text 
          v-for="type in questionTypes" 
          :key="type"
          class="type-tag"
          :class="{ 'active': selectedType === type }"
          @click="selectType(type)"
        >
          {{ type }}
        </text>
      </view>
    </view>
    
    <!-- 开始占卜按钮 -->
    <view class="action-section">
      <TraditionalButton 
        type="primary" 
        size="large"
        @click="startDivination"
        :disabled="!canStart"
      >
        {{ getButtonText }}
      </TraditionalButton>
    </view>
    
    <!-- 占卜说明 -->
    <view class="tips-section">
      <text class="tips-title">占卜须知</text>
      <view class="tips-list">
        <text class="tip-item">1. 心诚则灵，占卜前请静心凝神</text>
        <text class="tip-item">2. 一事一占，不要重复占卜同一问题</text>
        <text class="tip-item">3. 卦象仅供参考，命运掌握在自己手中</text>
        <text class="tip-item">4. 如结果不理想，可通过努力改变</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  divinationByNumber, 
  divinationByCoins, 
  divinationByTime, 
  divinationByRandom 
} from '@/utils/liuyaoCalculator.js'

// 当前占卜方式
const currentMethod = ref('number')

// 数字起卦输入
const number1 = ref('')
const number2 = ref('')
const number3 = ref('')

// 铜钱摇卦
const currentCoins = ref(['正', '正', '正'])
const currentYao = ref(1)
const coinResults = ref([])

// 占卜问题
const question = ref('')
const selectedType = ref('')
const questionTypes = ['事业', '感情', '财运', '健康', '学业', '出行']

// 计算属性
const canStart = computed(() => {
  switch (currentMethod.value) {
    case 'number':
      return number1.value && number2.value && number3.value
    case 'coins':
      // 铜钱摇卦按钮兼作"摇卦/记录爻"按钮，必须始终可点击
      return true
    case 'time':
    case 'random':
      return true
    default:
      return false
  }
})

const getButtonText = computed(() => {
  if (currentMethod.value === 'coins' && currentYao.value <= 6) {
    return `第 ${currentYao.value}/6 爻`
  }
  return '开始占卜'
})

// 选择占卜方式
const selectMethod = (method) => {
  currentMethod.value = method
  // 重置状态
  currentYao.value = 1
  coinResults.value = []
  number1.value = ''
  number2.value = ''
  number3.value = ''
}

// 翻转铜钱
const flipCoin = (index) => {
  currentCoins.value[index] = currentCoins.value[index] === '正' ? '反' : '正'
}

// 选择问题类型
const selectType = (type) => {
  selectedType.value = type
}

// 开始占卜
const startDivination = () => {
  if (currentMethod.value === 'coins' && currentYao.value <= 6) {
    // 记录当前铜钱结果
    coinResults.value.push(...currentCoins.value)
    currentYao.value++

    if (currentYao.value <= 6) {
      // 模拟重新摇卦：随机生成下一次的三枚铜钱
      currentCoins.value = [0, 1, 2].map(() => Math.random() < 0.5 ? '正' : '反')
      return
    }
  }
  
  // 执行占卜
  let result
  try {
    switch (currentMethod.value) {
      case 'number':
        result = divinationByNumber(
          Number(number1.value),
          Number(number2.value),
          Number(number3.value)
        )
        break
      case 'coins':
        result = divinationByCoins(coinResults.value)
        break
      case 'time':
        result = divinationByTime()
        break
      case 'random':
        result = divinationByRandom()
        break
    }
    
    // 保存占卜记录
    saveDivinationRecord(result)
    
    // 跳转到结果页面
    uni.navigateTo({
      url: `/pages/liuyao/result?data=${encodeURIComponent(JSON.stringify(result))}`
    })
  } catch (error) {
    uni.showToast({
      title: '占卜出错，请重试',
      icon: 'none'
    })
  }
}

// 保存占卜记录
const saveDivinationRecord = (result) => {
  const records = uni.getStorageSync('liuyaoRecords') || []
  const newRecord = {
    id: Date.now().toString(),
    type: 'liuyao',
    method: currentMethod.value,
    question: question.value,
    questionType: selectedType.value,
    result: result.benGua.name,
    time: Date.now()
  }
  
  records.unshift(newRecord)
  const limited = records.slice(0, 20)
  uni.setStorageSync('liuyaoRecords', limited)
}
</script>

<style lang="scss" scoped>
.liuyao-page {
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

// 区块标题
.section-title {
  display: block;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $primary;
  margin-bottom: 24rpx;
  font-family: 'Noto Serif SC', serif;
}

// 占卜方式选择
.method-section {
  margin-bottom: 40rpx;
  
  .method-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .method-card {
      background: white;
      border-radius: $border-radius-lg;
      padding: 32rpx 24rpx;
      text-align: center;
      box-shadow: $shadow-sm;
      border: 2rpx solid rgba($accent, 0.2);
      transition: $transition-fast;
      
      &.active {
        border-color: $accent;
        background: rgba($accent, 0.05);
        box-shadow: $shadow-md;
      }
      
      .method-icon {
        display: block;
        font-size: 48rpx;
        margin-bottom: 12rpx;
      }
      
      .method-name {
        display: block;
        font-size: $font-size-md;
        font-weight: 600;
        color: $primary;
        margin-bottom: 4rpx;
      }
      
      .method-desc {
        display: block;
        font-size: $font-size-xs;
        color: $text-secondary;
      }
    }
  }
}

// 数字输入
.input-section {
  margin-bottom: 40rpx;
  
  .input-form {
    background: white;
    border-radius: $border-radius-lg;
    padding: 32rpx;
    box-shadow: $shadow-sm;
    border: 2rpx solid rgba($accent, 0.2);
    
    .input-item {
      margin-bottom: 24rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .input-label {
        display: block;
        font-size: $font-size-sm;
        color: $text-secondary;
        margin-bottom: 8rpx;
      }
      
      .input-field {
        width: 100%;
        height: 80rpx;
        padding: 0 24rpx;
        background: $bg-secondary;
        border: 2rpx solid rgba($secondary, 0.3);
        border-radius: $border-radius-md;
        font-size: $font-size-md;
        color: $text-primary;
      }
    }
  }
}

// 铜钱摇卦
.coins-section {
  margin-bottom: 40rpx;
  text-align: center;
  
  .coins-display {
    display: flex;
    justify-content: center;
    gap: 32rpx;
    margin-bottom: 24rpx;
    
    .coin {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      font-weight: 700;
      transition: $transition-normal;
      box-shadow: $shadow-md;
      cursor: pointer;
      
      &.heads {
        background: linear-gradient(135deg, #ffd700, #ffed4a);
        color: #8b4513;
        border: 4rpx solid #daa520;
      }
      
      &.tails {
        background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
        color: #4a4a4a;
        border: 4rpx solid #a0a0a0;
      }
      
      .coin-text {
        font-size: 36rpx;
        font-weight: 700;
      }
    }
  }
  
  .coins-tip {
    display: block;
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: 24rpx;
  }
  
  .yao-progress {
    .progress-text {
      display: block;
      font-size: $font-size-md;
      color: $primary;
      margin-bottom: 12rpx;
      font-weight: 600;
    }
    
    .progress-bar {
      width: 100%;
      height: 16rpx;
      background: $bg-secondary;
      border-radius: 8rpx;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $accent, lighten($accent, 20%));
        border-radius: 8rpx;
        transition: width 0.3s ease;
      }
    }
  }
}

// 占卜问题
.question-section {
  margin-bottom: 40rpx;
  
  .question-input {
    width: 100%;
    height: 160rpx;
    padding: 24rpx;
    background: white;
    border: 2rpx solid rgba($accent, 0.2);
    border-radius: $border-radius-lg;
    font-size: $font-size-md;
    color: $text-primary;
    margin-bottom: 16rpx;
    box-shadow: $shadow-sm;
  }
  
  .question-types {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .type-tag {
      padding: 8rpx 20rpx;
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

// 操作区域
.action-section {
  margin-bottom: 40rpx;
  text-align: center;
}

// 占卜须知
.tips-section {
  background: white;
  border-radius: $border-radius-lg;
  padding: 32rpx;
  box-shadow: $shadow-sm;
  border: 2rpx solid rgba($accent, 0.2);
  
  .tips-title {
    display: block;
    font-size: $font-size-md;
    font-weight: 600;
    color: $primary;
    margin-bottom: 16rpx;
    font-family: 'Noto Serif SC', serif;
  }
  
  .tips-list {
    .tip-item {
      display: block;
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-bottom: 8rpx;
      line-height: 1.6;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
