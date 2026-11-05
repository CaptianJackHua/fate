<template>
  <button 
    class="traditional-button"
    :class="[
      `traditional-button--${type}`,
      `traditional-button--${size}`,
      { 'traditional-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <view class="button-content">
      <text v-if="icon" class="button-icon">{{ icon }}</text>
      <text class="button-text"><slot /></text>
    </view>
    <view class="button-decoration left"></view>
    <view class="button-decoration right"></view>
  </button>
</template>

<script setup>
/**
 * 传统风格按钮组件
 * 支持水墨晕染效果的古典按钮
 */
defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'outline'].includes(val)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  emit('click', e)
}
</script>

<style lang="scss" scoped>
.traditional-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  border-radius: $border-radius-md;
  transition: $transition-normal;
  overflow: hidden;
  
  // 主按钮样式
  &--primary {
    background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
    color: $accent-light;
    border: 2rpx solid $accent;
    
    &:active {
      transform: scale(0.98);
      background: linear-gradient(135deg, darken($primary, 5%) 0%, darken($primary, 15%) 100%);
    }
  }
  
  // 次要按钮样式
  &--secondary {
    background: linear-gradient(135deg, $bg-secondary 0%, darken($bg-secondary, 5%) 100%);
    color: $primary;
    border: 2rpx solid rgba($primary, 0.3);
    
    &:active {
      transform: scale(0.98);
      background: linear-gradient(135deg, darken($bg-secondary, 3%) 0%, darken($bg-secondary, 8%) 100%);
    }
  }
  
  // 描边按钮样式
  &--outline {
    background: transparent;
    color: $accent;
    border: 2rpx solid $accent;
    
    &:active {
      background: rgba($accent, 0.1);
    }
  }
  
  // 尺寸
  &--small {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
    .button-content {
      gap: $spacing-xs;
    }
  }
  
  &--medium {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-md;
    .button-content {
      gap: $spacing-sm;
    }
  }
  
  &--large {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
    .button-content {
      gap: $spacing-sm;
    }
  }
  
  // 禁用状态
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .button-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .button-icon {
      font-size: 1.2em;
    }
    
    .button-text {
      white-space: nowrap;
    }
  }
  
  // 装饰线
  .button-decoration {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30rpx;
    height: 60%;
    background: linear-gradient(to right, rgba($accent, 0.3), transparent);
    opacity: 0;
    transition: $transition-normal;
    
    &.left {
      left: 0;
      background: linear-gradient(to right, rgba($accent, 0.3), transparent);
    }
    
    &.right {
      right: 0;
      background: linear-gradient(to left, rgba($accent, 0.3), transparent);
    }
  }
  
  &:hover {
    .button-decoration {
      opacity: 1;
    }
  }
}
</style>
