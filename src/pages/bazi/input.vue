<template>
  <view class="bazi-input-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">八字排盘</text>
      <text class="page-subtitle">请输入您的出生信息</text>
    </view>
    
    <!-- 输入表单 -->
    <view class="input-form">
      <!-- 出生日期 -->
      <view class="form-item">
        <text class="form-label">出生日期</text>
        <picker 
          mode="date" 
          :value="birthDate"
          :start="startDate"
          :end="endDate"
          @change="onDateChange"
        >
          <view class="picker-value">
            <text :class="{ 'placeholder': !birthDate }">{{ birthDate || '请选择出生日期' }}</text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 出生时间 -->
      <view class="form-item">
        <text class="form-label">出生时间</text>
        <picker 
          mode="time" 
          :value="birthTime"
          @change="onTimeChange"
        >
          <view class="picker-value">
            <text :class="{ 'placeholder': !birthTime }">{{ birthTime || '请选择出生时间' }}</text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 性别 -->
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-options">
          <view 
            class="gender-option"
            :class="{ 'active': gender === '男' }"
            @click="selectGender('男')"
          >
            <text class="gender-icon">♂</text>
            <text class="gender-text">男</text>
          </view>
          <view 
            class="gender-option"
            :class="{ 'active': gender === '女' }"
            @click="selectGender('女')"
          >
            <text class="gender-icon">♀</text>
            <text class="gender-text">女</text>
          </view>
        </view>
      </view>
      
      <!-- 出生地点（可选） -->
      <view class="form-item">
        <text class="form-label">出生地点（可选）</text>
        <picker 
          mode="region" 
          :value="birthPlace"
          @change="onPlaceChange"
        >
          <view class="picker-value">
            <text :class="{ 'placeholder': !birthPlace.length }">
              {{ birthPlace.length ? birthPlace.join(' ') : '请选择出生地点' }}
            </text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 真太阳时校正 -->
      <view class="form-item">
        <view class="switch-item">
          <text class="form-label">真太阳时校正</text>
          <switch 
            :checked="useTrueSolarTime"
            @change="onSwitchChange"
            color="#c9a96e"
          />
        </view>
        <text class="form-tip">根据出生地点自动校正真太阳时，使排盘更精确</text>
      </view>
    </view>
    
    <!-- 开始排盘按钮 -->
    <view class="action-section">
      <TraditionalButton 
        type="primary" 
        size="large"
        @click="startCalculation"
        :disabled="!isFormValid"
      >
        开始排盘
      </TraditionalButton>
      
      <text class="action-tip">排盘结果仅供参考，命运掌握在自己手中</text>
    </view>
    
    <!-- 历史记录 -->
    <view class="history-section" v-if="historyList.length > 0">
      <view class="section-header">
        <text class="section-title">历史记录</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      
      <view class="history-list">
        <view 
          v-for="(item, index) in historyList" 
          :key="index"
          class="history-item"
          @click="useHistory(item)"
        >
          <view class="history-info">
            <text class="history-date">{{ item.date }}</text>
            <text class="history-time">{{ item.time }}</text>
          </view>
          <view class="history-gender">
            <text class="gender-tag" :class="item.gender === '男' ? 'male' : 'female'">{{ item.gender }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 表单数据
const birthDate = ref('')
const birthTime = ref('')
const gender = ref('')
const birthPlace = ref([])
const useTrueSolarTime = ref(true)

// 历史记录
const historyList = ref([])

// 日期范围
const startDate = ref('1900-01-01')
const endDate = ref('2030-12-31')

// 表单验证
const isFormValid = computed(() => {
  return birthDate.value && birthTime.value && gender.value
})

onMounted(() => {
  loadHistory()
})

// 加载历史记录
const loadHistory = () => {
  const history = uni.getStorageSync('baziHistory') || []
  historyList.value = history.slice(0, 5)
}

// 日期选择
const onDateChange = (e) => {
  birthDate.value = e.detail.value
}

// 时间选择
const onTimeChange = (e) => {
  birthTime.value = e.detail.value
}

// 性别选择
const selectGender = (selectedGender) => {
  gender.value = selectedGender
}

// 地点选择
const onPlaceChange = (e) => {
  birthPlace.value = e.detail.value
}

// 开关切换
const onSwitchChange = (e) => {
  useTrueSolarTime.value = e.detail.value
}

// 开始排盘
const startCalculation = () => {
  if (!isFormValid.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  // 解析日期时间
  const [year, month, day] = birthDate.value.split('-').map(Number)
  const [hour, minute] = birthTime.value.split(':').map(Number)
  
  // 保存到历史记录
  saveToHistory()
  
  // 跳转到结果页面
  uni.navigateTo({
    url: `/pages/bazi/result?year=${year}&month=${month}&day=${day}&hour=${hour}&gender=${gender.value}`
  })
}

// 保存到历史记录
const saveToHistory = () => {
  const history = uni.getStorageSync('baziHistory') || []
  const newRecord = {
    date: birthDate.value,
    time: birthTime.value,
    gender: gender.value,
    timestamp: Date.now()
  }
  
  // 去重并添加到开头
  const filtered = history.filter(item => 
    !(item.date === newRecord.date && item.time === newRecord.time && item.gender === newRecord.gender)
  )
  filtered.unshift(newRecord)
  
  // 最多保存20条
  const limited = filtered.slice(0, 20)
  uni.setStorageSync('baziHistory', limited)
  
  historyList.value = limited.slice(0, 5)
}

// 使用历史记录
const useHistory = (item) => {
  birthDate.value = item.date
  birthTime.value = item.time
  gender.value = item.gender
}

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('baziHistory')
        historyList.value = []
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.bazi-input-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 40rpx;
}

// 页面标题
.page-header {
  text-align: center;
  margin-bottom: 60rpx;
  
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

// 输入表单
.input-form {
  background: white;
  border-radius: $border-radius-lg;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: $shadow-md;
  border: 2rpx solid rgba($accent, 0.2);
}

.form-item {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .form-label {
    display: block;
    font-size: $font-size-md;
    font-weight: 600;
    color: $primary;
    margin-bottom: 16rpx;
    font-family: 'Noto Serif SC', serif;
  }
  
  .picker-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 24rpx;
    background: $bg-secondary;
    border-radius: $border-radius-md;
    border: 2rpx solid rgba($secondary, 0.3);
    
    text {
      font-size: $font-size-md;
      color: $text-primary;
      
      &.placeholder {
        color: $text-secondary;
      }
    }
    
    .picker-arrow {
      color: $accent;
      font-size: $font-size-lg;
    }
  }
  
  .gender-options {
    display: flex;
    gap: 24rpx;
    
    .gender-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx;
      background: $bg-secondary;
      border-radius: $border-radius-md;
      border: 2rpx solid rgba($secondary, 0.3);
      transition: $transition-fast;
      
      &.active {
        border-color: $accent;
        background: rgba($accent, 0.1);
      }
      
      .gender-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }
      
      .gender-text {
        font-size: $font-size-md;
        color: $text-primary;
      }
    }
  }
  
  .switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .form-label {
      margin-bottom: 0;
    }
  }
  
  .form-tip {
    display: block;
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-top: 8rpx;
  }
}

// 操作区域
.action-section {
  margin-bottom: 40rpx;
  text-align: center;
  
  .action-tip {
    display: block;
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-top: 16rpx;
  }
}

// 历史记录
.history-section {
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
    
    .clear-btn {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  .history-list {
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      background: white;
      border-radius: $border-radius-md;
      margin-bottom: 16rpx;
      box-shadow: $shadow-sm;
      border: 2rpx solid rgba($accent, 0.1);
      
      .history-info {
        .history-date {
          font-size: $font-size-md;
          color: $text-primary;
          margin-right: 16rpx;
        }
        
        .history-time {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
      
      .gender-tag {
        padding: 4rpx 16rpx;
        border-radius: $border-radius-sm;
        font-size: $font-size-xs;
        
        &.male {
          background: rgba($water-color, 0.2);
          color: $water-color;
        }
        
        &.female {
          background: rgba($fire-color, 0.2);
          color: $fire-color;
        }
      }
    }
  }
}
</style>
