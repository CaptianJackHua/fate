/**
 * 六爻占卜云函数
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const { type, data, userId } = event
  
  try {
    let result
    
    switch (type) {
      case 'number':
        result = await divinationByNumber(data.num1, data.num2, data.num3)
        break
      case 'coins':
        result = await divinationByCoins(data.coins)
        break
      case 'time':
        result = await divinationByTime(data.timestamp)
        break
      case 'random':
        result = await divinationByRandom()
        break
      default:
        throw new Error('无效的占卜类型')
    }
    
    // 保存占卜记录
    if (userId) {
      await saveDivinationRecord(userId, type, data, result)
    }
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 数字起卦
 */
async function divinationByNumber(num1, num2, num3) {
  // 模拟返回
  return {
    benGua: {
      name: '乾为天',
      symbol: '䷀',
      upper: '乾',
      lower: '乾',
      description: '元亨利贞',
      meaning: '大吉大利'
    },
    bianGua: {
      name: '天风姤',
      upper: '乾',
      lower: '巽'
    },
    dongYao: {
      position: 3,
      yaoCi: '君子终日乾乾'
    },
    interpretation: {
      overall: '此卦大吉',
      advice: '宜把握时机'
    }
  }
}

/**
 * 铜钱起卦
 */
async function divinationByCoins(coins) {
  return await divinationByNumber(1, 1, 3)
}

/**
 * 时间起卦
 */
async function divinationByTime(timestamp) {
  const date = new Date(timestamp)
  return await divinationByNumber(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

/**
 * 随机起卦
 */
async function divinationByRandom() {
  const num1 = Math.floor(Math.random() * 100) + 1
  const num2 = Math.floor(Math.random() * 100) + 1
  const num3 = Math.floor(Math.random() * 100) + 1
  return await divinationByNumber(num1, num2, num3)
}

/**
 * 保存占卜记录
 */
async function saveDivinationRecord(userId, type, inputData, result) {
  return await db.collection('divination_records').add({
    data: {
      userId,
      type,
      inputData,
      result,
      createdAt: db.serverDate()
    }
  })
}
