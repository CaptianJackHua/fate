<template>
  <view class="app-container">
    <view class="ink-background"></view>
    <view class="content-wrapper">
      <slot />
    </view>
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

// 应用启动
onLaunch(() => {
  console.log('App Launch')
  // 初始化云开发
  initCloud()
})

// 应用显示
onShow(() => {
  console.log('App Show')
})

// 应用隐藏
onHide(() => {
  console.log('App Hide')
})

// 初始化云开发
const initCloud = () => {
  // #ifdef MP-WEIXIN
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  } else {
    wx.cloud.init({
      env: 'your-cloud-env-id', // 替换为您的云环境ID
      traceUser: true,
    })
  }
  // #endif
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  position: relative;
}

.ink-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $bg-primary;
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba($primary, 0.06) 0%, transparent 60%);
    pointer-events: none;
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
}
</style>
