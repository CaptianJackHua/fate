/**
 * 数据库集合结构定义
 * 微信小程序云开发数据库
 */

// 用户集合
const usersCollection = {
  name: 'users',
  fields: {
    openid: 'string',           // 微信openid
    unionid: 'string',          // 微信unionid
    nickName: 'string',         // 昵称
    avatarUrl: 'string',        // 头像
    gender: 'number',           // 性别 0:未知 1:男 2:女
    country: 'string',          // 国家
    province: 'string',         // 省份
    city: 'string',             // 城市
    birthInfo: 'object',        // 出生信息
    vipLevel: 'number',         // VIP等级
    vipExpireAt: 'date',        // VIP过期时间
    calculationCount: 'number', // 测算次数
    createdAt: 'date',          // 创建时间
    updatedAt: 'date',          // 更新时间
    lastLoginAt: 'date'         // 最后登录时间
  },
  indexes: [
    { fields: { openid: 1 }, unique: true },
    { fields: { createdAt: -1 } }
  ]
}

// 八字测算记录集合
const calculationRecordsCollection = {
  name: 'calculation_records',
  fields: {
    userId: 'string',           // 用户ID
    type: 'string',             // 测算类型 bazi
    birthYear: 'number',        // 出生年
    birthMonth: 'number',       // 出生月
    birthDay: 'number',         // 出生日
    birthHour: 'number',        // 出生时
    gender: 'string',           // 性别
    result: 'object',           // 测算结果
    hasFeedback: 'boolean',     // 是否有反馈
    rating: 'number',           // 评分
    createdAt: 'date',          // 创建时间
    updatedAt: 'date'           // 更新时间
  },
  indexes: [
    { fields: { userId: 1, createdAt: -1 } },
    { fields: { type: 1 } }
  ]
}

// 六爻占卜记录集合
const divinationRecordsCollection = {
  name: 'divination_records',
  fields: {
    userId: 'string',           // 用户ID
    type: 'string',             // 占卜类型 number/coins/time/random
    inputData: 'object',        // 输入数据
    result: 'object',           // 占卜结果
    question: 'string',         // 占卜问题
    questionType: 'string',     // 问题类型
    hasFeedback: 'boolean',     // 是否有反馈
    rating: 'number',           // 评分
    createdAt: 'date',          // 创建时间
    updatedAt: 'date'           // 更新时间
  },
  indexes: [
    { fields: { userId: 1, createdAt: -1 } },
    { fields: { type: 1 } }
  ]
}

// 反馈集合
const feedbackCollection = {
  name: 'feedback',
  fields: {
    userId: 'string',           // 用户ID
    calculationId: 'string',    // 测算记录ID
    calculationType: 'string',  // 测算类型 bazi/liuyao
    rating: 'number',           // 评分 1-5
    feedback: 'string',         // 反馈内容
    isAccurate: 'boolean',      // 是否准确
    tags: 'array',              // 标签
    createdAt: 'date',          // 创建时间
    updatedAt: 'date'           // 更新时间
  },
  indexes: [
    { fields: { userId: 1, calculationId: 1 } },
    { fields: { calculationType: 1, rating: -1 } },
    { fields: { createdAt: -1 } }
  ]
}

// 系统配置集合
const configCollection = {
  name: 'config',
  fields: {
    key: 'string',              // 配置键
    value: 'any',               // 配置值
    description: 'string',      // 描述
    updatedAt: 'date'           // 更新时间
  },
  indexes: [
    { fields: { key: 1 }, unique: true }
  ]
}

// 卦象数据集合
const guaDataCollection = {
  name: 'gua_data',
  fields: {
    name: 'string',             // 卦名
    symbol: 'string',           // 卦象符号
    upper: 'string',            // 上卦
    lower: 'string',            // 下卦
    description: 'string',      // 卦辞
    meaning: 'string',          // 含义
    yaoCi: 'array',             // 爻辞
    attribute: 'string',        // 属性
    createdAt: 'date',          // 创建时间
    updatedAt: 'date'           // 更新时间
  },
  indexes: [
    { fields: { name: 1 }, unique: true },
    { fields: { upper: 1, lower: 1 } }
  ]
}

module.exports = {
  usersCollection,
  calculationRecordsCollection,
  divinationRecordsCollection,
  feedbackCollection,
  configCollection,
  guaDataCollection
}
