/**
 * 八字排盘核心算法（修正版）
 *
 * 修正内容：
 * 1. 日柱：基准日 1900-01-31 为甲辰日（六十甲子序40），修正原地支基准错位
 * 2. 月柱：修正月干、月支各差一位的错误
 * 3. 节气：采用寿星公式计算每年真实节气日期（1900-2099，误差±1天）
 * 4. 晚子时：23:00 后出生按次日子时论命（子平法传统）
 * 5. 起运：按出生日至前/后节气天数折三计算
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 五行属性
const WU_XING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

// 天干阴阳
const TIAN_GAN_YIN_YANG = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
}

// 十神关系（以日干为基准）
const SHI_SHEN_RELATIONS = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
}

// 地支藏干
const DI_ZHI_CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
}

/**
 * 十二"节"（月建分界），按节气顺序排列
 * branchIndex: 该节所起月份的月支（寅月始于立春）
 * c21: 21世纪寿星公式常数（20世纪 +1）
 */
const JIE_LIST = [
  { name: '立春', month: 2, branchIndex: 2, c21: 3.87 },
  { name: '惊蛰', month: 3, branchIndex: 3, c21: 5.63 },
  { name: '清明', month: 4, branchIndex: 4, c21: 4.81 },
  { name: '立夏', month: 5, branchIndex: 5, c21: 5.52 },
  { name: '芒种', month: 6, branchIndex: 6, c21: 5.678 },
  { name: '小暑', month: 7, branchIndex: 7, c21: 7.108 },
  { name: '立秋', month: 8, branchIndex: 8, c21: 7.5 },
  { name: '白露', month: 9, branchIndex: 9, c21: 7.646 },
  { name: '寒露', month: 10, branchIndex: 10, c21: 8.318 },
  { name: '立冬', month: 11, branchIndex: 11, c21: 7.438 },
  { name: '大雪', month: 12, branchIndex: 0, c21: 7.18 },
  { name: '小寒', month: 1, branchIndex: 1, c21: 5.4055 }
]

/**
 * 寿星公式计算某年某"节"的日期
 * 公式：[Y×D+C]−L，Y=年份后两位，D=0.2422
 * 1-2月的节 L=⌊(Y−1)/4⌋，其余 L=⌊Y/4⌋
 * （非闰世纪年如1900/2100年，Y=0时1-2月L=0）
 * 适用 1900-2099 年，误差 ±1 天
 */
function getJieQiDay(year, jie) {
  const Y = year % 100
  let C = jie.c21
  if (year < 2001) C += 1 // 20世纪常数

  let L
  if (jie.month <= 2) {
    if (Y === 0 && year % 400 !== 0) {
      L = 0 // 1900/2100 等非闰世纪年
    } else {
      L = Math.floor((Y - 1) / 4)
    }
  } else {
    L = Math.floor(Y / 4)
  }
  return Math.floor(Y * 0.2422 + C) - L
}

/** 获取某年某"节"的完整日期对象 */
function getJieQiDate(year, jie) {
  return new Date(year, jie.month - 1, getJieQiDay(year, jie))
}

/**
 * 确定日期所处的"节"（月建）
 * @returns {{ jie: object, jieYear: number }} 节信息及其所属年份
 */
function getCurrentJie(year, month, day) {
  const date = new Date(year, month - 1, day)
  // 小寒在上一年12月之后、本年立春之前，需要跨年比较
  // 构造候选节列表：上一年大雪、本年全部12节
  const candidates = []
  for (const jie of JIE_LIST) {
    candidates.push({ jie, year: year - 1, date: getJieQiDate(year - 1, jie) })
    candidates.push({ jie, year, date: getJieQiDate(year, jie) })
  }
  candidates.sort((a, b) => a.date - b.date)

  let current = null
  for (const c of candidates) {
    if (date >= c.date) current = c
    else break
  }
  return current
}

/**
 * 计算年柱（以立春为岁首）
 */
function calculateYearPillar(year, month, day) {
  const date = new Date(year, month - 1, day)
  const liChun = getJieQiDate(year, JIE_LIST[0]) // 立春
  const nian = date < liChun ? year - 1 : year

  const ganIndex = ((nian - 4) % 10 + 10) % 10
  const zhiIndex = ((nian - 4) % 12 + 12) % 12

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
    ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex],
    year: nian
  }
}

/**
 * 计算月柱（以十二节为月界）
 * 年上起月法：甲己之年丙作首，乙庚之岁戊为头，
 * 丙辛之岁寻庚起，丁壬壬位顺行流，戊癸甲寅求。
 */
function calculateMonthPillar(year, month, day) {
  const current = getCurrentJie(year, month, day)
  const branchIndex = current.jie.branchIndex // 月支
  // 月干偏移：寅月为0，顺推
  const offset = (branchIndex - 2 + 12) % 12

  // 月干依年干而定；注意未过立春时按上一岁年干
  const yearGan = calculateYearPillar(year, month, day).gan
  const yearGanIndex = TIAN_GAN.indexOf(yearGan)
  const monthGanStart = [2, 4, 6, 8, 0][yearGanIndex % 5] // 丙戊庚壬甲
  const ganIndex = (monthGanStart + offset) % 10

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[branchIndex],
    ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[branchIndex],
    jieQi: current.jie.name
  }
}

/**
 * 计算日柱
 * 基准：1900年1月31日为甲辰日（六十甲子序40）
 */
function calculateDayPillar(year, month, day) {
  const baseDate = new Date(1900, 0, 31)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.round((targetDate - baseDate) / 86400000)

  const idx = ((40 + diffDays) % 60 + 60) % 60
  const ganIndex = idx % 10
  const zhiIndex = idx % 12

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
    ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex]
  }
}

/**
 * 计算时柱
 * 日上起时法：甲己还加甲，乙庚丙作初，
 * 丙辛从戊起，丁壬庚子居，戊癸壬子真。
 */
function calculateHourPillar(dayGan, hour) {
  const shiChen = [
    { start: 23, end: 1, name: '子时' },
    { start: 1, end: 3, name: '丑时' },
    { start: 3, end: 5, name: '寅时' },
    { start: 5, end: 7, name: '卯时' },
    { start: 7, end: 9, name: '辰时' },
    { start: 9, end: 11, name: '巳时' },
    { start: 11, end: 13, name: '午时' },
    { start: 13, end: 15, name: '未时' },
    { start: 15, end: 17, name: '申时' },
    { start: 17, end: 19, name: '酉时' },
    { start: 19, end: 21, name: '戌时' },
    { start: 21, end: 23, name: '亥时' }
  ]

  let shiChenIndex = 0
  for (let i = 0; i < shiChen.length; i++) {
    const sc = shiChen[i]
    if (sc.start > sc.end) {
      if (hour >= sc.start || hour < sc.end) { shiChenIndex = i; break }
    } else {
      if (hour >= sc.start && hour < sc.end) { shiChenIndex = i; break }
    }
  }

  const dayGanIndex = TIAN_GAN.indexOf(dayGan)
  const hourGanStart = [0, 2, 4, 6, 8][dayGanIndex % 5] // 甲丙戊庚壬
  const ganIndex = (hourGanStart + shiChenIndex) % 10

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[shiChenIndex],
    ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[shiChenIndex],
    shiChen: shiChen[shiChenIndex].name
  }
}

/** 计算十神 */
function calculateShiShen(dayGan, targetGan) {
  return SHI_SHEN_RELATIONS[dayGan][targetGan]
}

/** 分析五行旺衰 */
function analyzeWuXing(bazi) {
  const wuXingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  const wuXingDetails = []

  const pillars = ['year', 'month', 'day', 'hour']
  pillars.forEach(pillar => {
    const gan = bazi[pillar].gan
    const zhi = bazi[pillar].zhi

    const ganWuXing = WU_XING[gan]
    wuXingCount[ganWuXing]++
    wuXingDetails.push({ position: `${pillar}干`, character: gan, wuXing: ganWuXing })

    const zhiWuXing = WU_XING[zhi]
    wuXingCount[zhiWuXing]++
    wuXingDetails.push({ position: `${pillar}支`, character: zhi, wuXing: zhiWuXing })

    DI_ZHI_CANG_GAN[zhi].forEach(g => {
      const gWuXing = WU_XING[g]
      wuXingCount[gWuXing] += 0.5 // 藏干权重减半
      wuXingDetails.push({ position: `${pillar}支藏干`, character: g, wuXing: gWuXing })
    })
  })

  const dayGanWuXing = WU_XING[bazi.day.gan]
  const isWang = wuXingCount[dayGanWuXing] >= 3

  return {
    count: wuXingCount,
    details: wuXingDetails,
    dayMasterWuXing: dayGanWuXing,
    isWang,
    strongest: Object.entries(wuXingCount).sort((a, b) => b[1] - a[1])[0][0],
    weakest: Object.entries(wuXingCount).sort((a, b) => a[1] - b[1])[0][0]
  }
}

/**
 * 计算大运（含起运年龄）
 * 阳男阴女顺行，阴男阳女逆行；
 * 起运数 = 出生日至前/后"节"的天数 ÷ 3（三天折一年）
 */
function calculateDaYun(bazi, gender, year, month, day) {
  const yearGanYinYang = TIAN_GAN_YIN_YANG[bazi.year.gan]
  const isShun = (yearGanYinYang === '阳' && gender === '男') ||
                 (yearGanYinYang === '阴' && gender === '女')

  // 计算起运天数
  const birthDate = new Date(year, month - 1, day)
  const candidates = []
  for (const jie of JIE_LIST) {
    for (const y of [year - 1, year, year + 1]) {
      candidates.push(getJieQiDate(y, jie))
    }
  }
  candidates.sort((a, b) => a - b)

  let qiYunDays = 3
  if (isShun) {
    const next = candidates.find(d => d > birthDate)
    if (next) qiYunDays = Math.max(1, Math.round((next - birthDate) / 86400000))
  } else {
    const prevList = candidates.filter(d => d <= birthDate)
    const prev = prevList[prevList.length - 1]
    if (prev) qiYunDays = Math.max(1, Math.round((birthDate - prev) / 86400000))
  }
  const qiYunAge = Math.max(1, Math.round(qiYunDays / 3))

  const daYun = []
  const startZhiIndex = DI_ZHI.indexOf(bazi.month.zhi)
  const startGanIndex = TIAN_GAN.indexOf(bazi.month.gan)

  for (let i = 1; i <= 10; i++) {
    let zhiIndex, ganIndex
    if (isShun) {
      zhiIndex = (startZhiIndex + i) % 12
      ganIndex = (startGanIndex + i) % 10
    } else {
      zhiIndex = (startZhiIndex - i + 12) % 12
      ganIndex = (startGanIndex - i + 10) % 10
    }
    daYun.push({
      ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex],
      gan: TIAN_GAN[ganIndex],
      zhi: DI_ZHI[zhiIndex],
      age: qiYunAge + (i - 1) * 10,
      shiShen: calculateShiShen(bazi.day.gan, TIAN_GAN[ganIndex])
    })
  }
  return daYun
}

/**
 * 主函数：计算八字
 * 晚子时（23:00-24:00）按次日论命
 */
export function calculateBaZi(year, month, day, hour, gender) {
  // 晚子时处理：23点后日柱按次日
  let y = year, m = month, d = day
  if (hour >= 23) {
    const next = new Date(year, month - 1, day + 1)
    y = next.getFullYear(); m = next.getMonth() + 1; d = next.getDate()
  }

  const yearPillar = calculateYearPillar(y, m, d)
  const monthPillar = calculateMonthPillar(y, m, d)
  const dayPillar = calculateDayPillar(y, m, d)
  const hourPillar = calculateHourPillar(dayPillar.gan, hour)

  const bazi = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar }

  const shiShen = {
    year: {
      gan: calculateShiShen(dayPillar.gan, yearPillar.gan),
      zhi: calculateShiShen(dayPillar.gan, DI_ZHI_CANG_GAN[yearPillar.zhi][0])
    },
    month: {
      gan: calculateShiShen(dayPillar.gan, monthPillar.gan),
      zhi: calculateShiShen(dayPillar.gan, DI_ZHI_CANG_GAN[monthPillar.zhi][0])
    },
    day: {
      gan: '日主',
      zhi: calculateShiShen(dayPillar.gan, DI_ZHI_CANG_GAN[dayPillar.zhi][0])
    },
    hour: {
      gan: calculateShiShen(dayPillar.gan, hourPillar.gan),
      zhi: calculateShiShen(dayPillar.gan, DI_ZHI_CANG_GAN[hourPillar.zhi][0])
    }
  }

  const wuXing = analyzeWuXing(bazi)
  const daYun = calculateDaYun(bazi, gender, y, m, d)
  const interpretation = generateInterpretation(bazi, shiShen, wuXing, daYun)

  return {
    bazi,
    shiShen,
    wuXing,
    daYun,
    interpretation,
    meta: {
      birthDate: `${year}年${month}月${day}日 ${hour}时`,
      gender,
      dayMaster: dayPillar.gan,
      dayMasterWuXing: wuXing.dayMasterWuXing,
      lateZiShi: hour >= 23 // 标记晚子时
    }
  }
}

/** 生成命理解读 */
function generateInterpretation(bazi, shiShen, wuXing, daYun) {
  const dayMaster = bazi.day.gan
  const dayMasterWuXing = wuXing.dayMasterWuXing

  const strengthText = wuXing.isWang
    ? `${dayMaster}日主得令得地，身强有力，能担财官`
    : `${dayMaster}日主失令失地，身弱需扶，宜印比相助`

  const fmt = v => Number.isInteger(v) ? v : v.toFixed(1)
  const wuXingText = `五行分布：金${fmt(wuXing.count['金'])}、木${fmt(wuXing.count['木'])}、水${fmt(wuXing.count['水'])}、火${fmt(wuXing.count['火'])}、土${fmt(wuXing.count['土'])}。最旺为${wuXing.strongest}，最弱为${wuXing.weakest}。`

  const personalityTraits = {
    '甲': '仁慈正直，有领导才能，但性急',
    '乙': '温柔随和，善于交际，但优柔寡断',
    '丙': '热情开朗，聪明伶俐，但易冲动',
    '丁': '温和有礼，心思细腻，但多疑',
    '戊': '诚实守信，稳重踏实，但固执',
    '己': '宽容大度，善于理财，但懒散',
    '庚': '刚毅果断，讲义气，但刚愎自用',
    '辛': '聪明灵巧，善于表达，但虚荣心强',
    '壬': '聪明机智，善于变通，但多变',
    '癸': '温柔善良，有艺术天赋，但多愁善感'
  }
  const personalityText = `性格特点：${personalityTraits[dayMaster] || '性格平和，为人正直'}`

  const currentDaYun = daYun[0]
  const daYunText = `当前大运：${currentDaYun.ganZhi}（${currentDaYun.age}岁起运），十神为${currentDaYun.shiShen}，此运${currentDaYun.shiShen === '正官' || currentDaYun.shiShen === '正财' ? '较为顺利' : '需谨慎行事'}。`

  return {
    summary: `${dayMaster}日主，${dayMasterWuXing}命。${strengthText}`,
    personality: personalityText,
    wuXing: wuXingText,
    career: `事业方面，${shiShen.month.gan === '正官' || shiShen.month.gan === '七杀' ? '适合公职或管理岗位' : '适合自由职业或技术工作'}。`,
    marriage: `婚姻方面，${shiShen.day.zhi === '正财' || shiShen.day.zhi === '偏财' ? '异性缘佳，婚姻美满' : '需多加经营，相互理解'}。`,
    health: `健康方面，需注意${wuXing.weakest === '金' ? '呼吸系统' : wuXing.weakest === '木' ? '肝胆' : wuXing.weakest === '水' ? '肾脏' : wuXing.weakest === '火' ? '心脏' : '脾胃'}方面的保养。`,
    daYun: daYunText,
    advice: `建议：${wuXing.isWang ? '身强宜泄，可从事与' + wuXing.strongest + '相关的行业' : '身弱宜扶，宜与' + wuXing.strongest + '旺的人合作'}`
  }
}

/** 阳历转阴历（占位，建议使用完整农历库） */
export function solarToLunar(year, month, day) {
  return { year, month, day, isLeap: false }
}

/** 获取生肖 */
export function getShengXiao(zhi) {
  const shengXiao = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return shengXiao[DI_ZHI.indexOf(zhi)]
}

/** 获取纳音 */
export function getNaYin(ganZhi) {
  const naYinMap = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
    '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
    '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
  }
  return naYinMap[ganZhi] || '未知'
}

export default {
  calculateBaZi,
  solarToLunar,
  getShengXiao,
  getNaYin
}
