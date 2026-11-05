/**
 * 反馈评价云函数
 * 收集用户反馈，用于算法优化
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'submit':
        return await submitFeedback(data)
      case 'getStats':
        return await getFeedbackStats(data)
      case 'getList':
        return await getFeedbackList(data)
      default:
        return { success: false, error: '无效的操作类型' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 提交反馈
 */
async function submitFeedback(data) {
  const {
    userId,
    calculationId,
    calculationType,
    rating,
    feedback,
    isAccurate,
    tags = []
  } = data
  
  // 验证必填字段
  if (!calculationId || !calculationType || !rating) {
    return { success: false, error: '缺少必填字段' }
  }
  
  // 检查是否已提交过反馈
  const existingFeedback = await db.collection('feedback').where({
    userId: userId,
    calculationId: calculationId
  }).get()
  
  if (existingFeedback.data.length > 0) {
    // 更新已有反馈
    await db.collection('feedback').doc(existingFeedback.data[0]._id).update({
      data: {
        rating,
        feedback,
        isAccurate,
        tags,
        updatedAt: db.serverDate()
      }
    })
  } else {
    // 创建新反馈
    await db.collection('feedback').add({
      data: {
        userId: userId,
        calculationId: calculationId,
        calculationType: calculationType,
        rating: rating,
        feedback: feedback || '',
        isAccurate: isAccurate !== undefined ? isAccurate : null,
        tags: tags,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
  }
  
  // 更新测算记录的反馈状态
  const collectionName = calculationType === 'bazi' ? 'calculation_records' : 'divination_records'
  await db.collection(collectionName).doc(calculationId).update({
    data: {
      hasFeedback: true,
      rating: rating,
      updatedAt: db.serverDate()
    }
  })
  
  return { success: true }
}

/**
 * 获取反馈统计
 */
async function getFeedbackStats(data) {
  const { calculationType, startDate, endDate } = data
  
  const whereCondition = {}
  
  if (calculationType) {
    whereCondition.calculationType = calculationType
  }
  
  if (startDate && endDate) {
    whereCondition.createdAt = _.gte(new Date(startDate)).and(_.lte(new Date(endDate)))
  }
  
  // 获取总反馈数
  const totalResult = await db.collection('feedback').where(whereCondition).count()
  const total = totalResult.total
  
  // 获取各星级数量
  const ratingStats = {}
  for (let i = 1; i <= 5; i++) {
    const countResult = await db.collection('feedback').where({
      ...whereCondition,
      rating: i
    }).count()
    ratingStats[i] = countResult.total
  }
  
  // 计算平均评分
  const allFeedback = await db.collection('feedback').where(whereCondition).get()
  const totalRating = allFeedback.data.reduce((sum, item) => sum + item.rating, 0)
  const averageRating = total > 0 ? (totalRating / total).toFixed(2) : 0
  
  // 准确率统计
  const accurateCount = allFeedback.data.filter(item => item.isAccurate === true).length
  const inaccurateCount = allFeedback.data.filter(item => item.isAccurate === false).length
  
  return {
    success: true,
    data: {
      total,
      averageRating,
      ratingDistribution: ratingStats,
      accuracy: {
        accurate: accurateCount,
        inaccurate: inaccurateCount,
        accuracyRate: total > 0 ? ((accurateCount / total) * 100).toFixed(2) : 0
      }
    }
  }
}

/**
 * 获取反馈列表
 */
async function getFeedbackList(data) {
  const { page = 1, pageSize = 20, calculationType, minRating } = data
  
  const whereCondition = {}
  
  if (calculationType) {
    whereCondition.calculationType = calculationType
  }
  
  if (minRating) {
    whereCondition.rating = _.gte(minRating)
  }
  
  const skip = (page - 1) * pageSize
  
  const feedbackResult = await db.collection('feedback')
    .where(whereCondition)
    .orderBy('createdAt', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()
  
  return {
    success: true,
    data: {
      list: feedbackResult.data,
      page,
      pageSize,
      total: feedbackResult.data.length
    }
  }
}
