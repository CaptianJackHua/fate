<template>
  <view class="bagua-diagram" :class="{ 'bagua-diagram--animated': animated }">
    <view class="diagram-container">
      <!-- 八卦符号 -->
      <view 
        v-for="(trigram, index) in trigrams" 
        :key="index"
        class="trigram"
        :class="`trigram--${index}`"
        :style="getTrigramStyle(index)"
      >
        <text class="trigram-symbol">{{ trigram.symbol }}</text>
        <text class="trigram-name">{{ trigram.name }}</text>
      </view>
      
      <!-- 中心太极图 -->
      <view class="taiji">
        <view class="taiji-yin"></view>
        <view class="taiji-yang"></view>
        <view class="taiji-dot yin-dot"></view>
        <view class="taiji-dot yang-dot"></view>
      </view>
      
      <!-- 装饰圆环 -->
      <view class="decoration-ring"></view>
    </view>
  </view>
</template>

<script setup>
/**
 * 八卦图组件
 * 展示传统八卦方位图，中心为太极图
 */
const props = defineProps({
  size: {
    type: Number,
    default: 400
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// 八卦数据
const trigrams = [
  { name: '乾', symbol: '☰', nature: '天', position: '西北' },
  { name: '兑', symbol: '☱', nature: '泽', position: '西' },
  { name: '离', symbol: '☲', nature: '火', position: '南' },
  { name: '震', symbol: '☳', nature: '雷', position: '东' },
  { name: '巽', symbol: '☴', nature: '风', position: '东南' },
  { name: '坎', symbol: '☵', nature: '水', position: '北' },
  { name: '艮', symbol: '☶', nature: '山', position: '东北' },
  { name: '坤', symbol: '☷', nature: '地', position: '西南' }
]

// 计算八卦位置
const getTrigramStyle = (index) => {
  const angle = (index * 45 - 90) * (Math.PI / 180)
  const radius = props.size * 0.35
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return {
    transform: `translate(${x}rpx, ${y}rpx)`,
    left: '50%',
    top: '50%'
  }
}
</script>

<style lang="scss" scoped>
.bagua-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-lg;
  
  .diagram-container {
    position: relative;
    width: 400rpx;
    height: 400rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  // 八卦符号
  .trigram {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    margin-left: -40rpx;
    margin-top: -40rpx;
    
    .trigram-symbol {
      font-size: 48rpx;
      color: $primary;
      line-height: 1;
    }
    
    .trigram-name {
      font-size: $font-size-xs;
      color: $text-secondary;
      margin-top: $spacing-xs;
      font-family: 'Noto Serif SC', serif;
    }
  }
  
  // 太极图
  .taiji {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid $primary;
    overflow: hidden;
    background: white;
    
    .taiji-yin {
      position: absolute;
      width: 50%;
      height: 100%;
      background: $primary;
      left: 0;
      top: 0;
    }
    
    .taiji-yang {
      position: absolute;
      width: 50%;
      height: 100%;
      background: white;
      right: 0;
      top: 0;
    }
    
    &::before {
      content: '';
      position: absolute;
      width: 50%;
      height: 50%;
      background: $primary;
      border-radius: 50%;
      top: 0;
      left: 25%;
      z-index: 1;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 50%;
      height: 50%;
      background: white;
      border-radius: 50%;
      bottom: 0;
      left: 25%;
      z-index: 1;
    }
    
    .taiji-dot {
      position: absolute;
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      z-index: 2;
      
      &.yin-dot {
        background: white;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      &.yang-dot {
        background: $primary;
        bottom: 25%;
        left: 50%;
        transform: translate(-50%, 50%);
      }
    }
  }
  
  // 装饰圆环
  .decoration-ring {
    position: absolute;
    width: 320rpx;
    height: 320rpx;
    border: 2rpx solid rgba($accent, 0.3);
    border-radius: 50%;
    
    &::before {
      content: '';
      position: absolute;
      width: 360rpx;
      height: 360rpx;
      border: 1rpx solid rgba($accent, 0.15);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  
  // 动画效果
  &--animated {
    .diagram-container {
      animation: rotate 20s linear infinite;
    }
    
    .trigram {
      animation: counterRotate 20s linear infinite;
    }
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes counterRotate {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(-360deg);
      }
    }
  }
}
</style>
