/**
 * 用户认证云函数
 * 处理微信登录、用户信息存储
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'login':
        return await handleLogin(data)
      case 'updateProfile':
        return await updateProfile(data)
      case 'getProfile':
        return await getProfile(data)
      default:
        return { success: false, error: '无效的操作类型' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 处理微信登录
 */
async function handleLogin(data) {
  const { code, userInfo } = data
  
  // 获取微信用户信息
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  if (!openid) {
    return { success: false, error: '获取用户信息失败' }
  }
  
  // 查询用户是否已存在
  const userResult = await db.collection('users').where({
    openid: openid
  }).get()
  
  let userData
  
  if (userResult.data.length === 0) {
    // 新用户，创建记录
    userData = {
      openid: openid,
      unionid: wxContext.UNIONID || '',
      nickName: userInfo?.nickName || '微信用户',
      avatarUrl: userInfo?.avatarUrl || '',
      gender: userInfo?.gender || 0,
      country: userInfo?.country || '',
      province: userInfo?.province || '',
      city: userInfo?.city || '',
      birthInfo: null,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
      lastLoginAt: db.serverDate(),
      calculationCount: 0,
      vipLevel: 0,
      vipExpireAt: null
    }
    
    await db.collection('users').add({
      data: userData
    })
  } else {
    // 更新登录时间
    userData = userResult.data[0]
    await db.collection('users').doc(userData._id).update({
      data: {
        lastLoginAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
  }
  
  return {
    success: true,
    data: {
      userId: userData._id,
      openid: userData.openid,
      nickName: userData.nickName,
      avatarUrl: userData.avatarUrl,
      vipLevel: userData.vipLevel,
      vipExpireAt: userData.vipExpireAt
    }
  }
}

/**
 * 更新用户资料
 */
async function updateProfile(data) {
  const { userId, profile } = data
  
  const updateData = {
    updatedAt: db.serverDate()
  }
  
  // 允许更新的字段
  const allowedFields = ['nickName', 'avatarUrl', 'gender', 'birthInfo']
  
  allowedFields.forEach(field => {
    if (profile[field] !== undefined) {
      updateData[field] = profile[field]
    }
  })
  
  await db.collection('users').doc(userId).update({
    data: updateData
  })
  
  return { success: true }
}

/**
 * 获取用户资料
 */
async function getProfile(data) {
  const { userId } = data
  
  const userResult = await db.collection('users').doc(userId).get()
  
  if (!userResult.data) {
    return { success: false, error: '用户不存在' }
  }
  
  const userData = userResult.data
  
  // 统计测算次数
  const baziCount = await db.collection('calculation_records').where({
    userId: userId,
    type: 'bazi'
  }).count()
  
  const liuyaoCount = await db.collection('divination_records').where({
    userId: userId
  }).count()
  
  return {
    success: true,
    data: {
      userId: userData._id,
      nickName: userData.nickName,
      avatarUrl: userData.avatarUrl,
      gender: userData.gender,
      birthInfo: userData.birthInfo,
      vipLevel: userData.vipLevel,
      vipExpireAt: userData.vipExpireAt,
      calculationCount: {
        bazi: baziCount.total,
        liuyao: liuyaoCount.total,
        total: baziCount.total + liuyaoCount.total
      },
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt
    }
  }
}
