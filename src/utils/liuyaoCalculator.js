/**
 * 六爻占卜核心算法
 * 包含起卦、排卦、解卦等功能
 */

// 八卦
const BA_GUA = {
  '111': { name: '乾', symbol: '☰', nature: '天', attribute: '金' },
  '011': { name: '兑', symbol: '☱', nature: '泽', attribute: '金' },
  '101': { name: '离', symbol: '☲', nature: '火', attribute: '火' },
  '001': { name: '震', symbol: '☳', nature: '雷', attribute: '木' },
  '110': { name: '巽', symbol: '☴', nature: '风', attribute: '木' },
  '010': { name: '坎', symbol: '☵', nature: '水', attribute: '水' },
  '100': { name: '艮', symbol: '☶', nature: '山', attribute: '土' },
  '000': { name: '坤', symbol: '☷', nature: '地', attribute: '土' }
}

// 六十四卦
const LIU_SHI_SI_GUA = {
  '乾为天': {
    symbol: '䷀',
    upper: '乾',
    lower: '乾',
    description: '元亨利贞',
    meaning: '大吉大利，万事如意',
    yaoCi: [
      '潜龙勿用',
      '见龙在田，利见大人',
      '君子终日乾乾，夕惕若厉，无咎',
      '或跃在渊，无咎',
      '飞龙在天，利见大人',
      '亢龙有悔'
    ]
  },
  '坤为地': {
    symbol: '䷁',
    upper: '坤',
    lower: '坤',
    description: '元亨，利牝马之贞',
    meaning: '柔顺守正，厚德载物',
    yaoCi: [
      '履霜，坚冰至',
      '直方大，不习无不利',
      '含章可贞，或从王事，无成有终',
      '括囊，无咎无誉',
      '黄裳，元吉',
      '龙战于野，其血玄黄'
    ]
  },
  '水雷屯': {
    symbol: '䷂',
    upper: '坎',
    lower: '震',
    description: '元亨利贞，勿用有攸往，利建侯',
    meaning: '初生艰难，宜守静待时',
    yaoCi: [
      '磐桓，利居贞，利建侯',
      '屯如邅如，乘马班如，匪寇婚媾',
      '即鹿无虞，惟入于林中',
      '乘马班如，求婚媾，往吉，无不利',
      '屯其膏，小贞吉，大贞凶',
      '乘马班如，泣血涟如'
    ]
  },
  '山水蒙': {
    symbol: '䷃',
    upper: '艮',
    lower: '坎',
    description: '亨。匪我求童蒙，童蒙求我',
    meaning: '启蒙教育，循序渐进',
    yaoCi: [
      '发蒙，利用刑人，用说桎梏',
      '包蒙，吉。纳妇，吉。子克家',
      '勿用取女，见金夫，不有躬',
      '困蒙，吝',
      '童蒙，吉',
      '击蒙，不利为寇，利御寇'
    ]
  },
  '水天需': {
    symbol: '䷄',
    upper: '坎',
    lower: '乾',
    description: '有孚，光亨，贞吉，利涉大川',
    meaning: '等待时机，守正待时',
    yaoCi: [
      '需于郊，利用恒，无咎',
      '需于沙，小有言，终吉',
      '需于泥，致寇至',
      '需于血，出自穴',
      '需于酒食，贞吉',
      '入于穴，有不速之客三人来，敬之终吉'
    ]
  },
  '天水讼': {
    symbol: '䷅',
    upper: '乾',
    lower: '坎',
    description: '有孚，窒惕，中吉，终凶',
    meaning: '争讼之事，宜和解',
    yaoCi: [
      '不永所事，小有言，终吉',
      '不克讼，归而逋，其邑人三百户，无眚',
      '食旧德，贞厉，终吉',
      '不克讼，复即命，渝，安贞吉',
      '讼，元吉',
      '或锡之鞶带，终朝三褫之'
    ]
  },
  '地水师': {
    symbol: '䷆',
    upper: '坤',
    lower: '坎',
    description: '贞，丈人吉，无咎',
    meaning: '用兵之道，纪律严明',
    yaoCi: [
      '师出以律，否臧凶',
      '在师中，吉，无咎，王三锡命',
      '师或舆尸，凶',
      '师左次，无咎',
      '田有禽，利执言，无咎',
      '大君有命，开国承家，小人勿用'
    ]
  },
  '水地比': {
    symbol: '䷇',
    upper: '坎',
    lower: '坤',
    description: '吉。原筮，元永贞，无咎',
    meaning: '亲比团结，择善而交',
    yaoCi: [
      '有孚比之，无咎',
      '比之自内，贞吉',
      '比之匪人',
      '外比之，贞吉',
      '显比，王用三驱，失前禽',
      '比之无首，凶'
    ]
  }
  // 可以继续添加其他卦象...
}

// 六兽（六神）
const LIU_SHOU = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武']

/**
 * 数字起卦
 * @param {number} num1 - 第一个数字（上卦）
 * @param {number} num2 - 第二个数字（下卦）
 * @param {number} num3 - 第三个数字（动爻）
 * @returns {object} 卦象信息
 */
export function divinationByNumber(num1, num2, num3) {
  // 计算上卦
  const upperIndex = (num1 % 8) || 8
  const upperGua = Object.values(BA_GUA)[upperIndex - 1]
  
  // 计算下卦
  const lowerIndex = (num2 % 8) || 8
  const lowerGua = Object.values(BA_GUA)[lowerIndex - 1]
  
  // 计算动爻
  const movingYao = (num3 % 6) || 6
  
  return generateGuaXiang(upperGua, lowerGua, movingYao)
}

/**
 * 铜钱摇卦
 * @param {array} coins - 铜钱结果数组，每个元素为'正'或'反'
 * @returns {object} 卦象信息
 */
export function divinationByCoins(coins) {
  // 确保有18次摇卦结果（3枚铜钱 × 6爻）
  if (coins.length !== 18) {
    throw new Error('需要18次摇卦结果')
  }
  
  const yaoResults = []
  
  // 每3枚铜钱为一爻，从下到上
  for (let i = 0; i < 6; i++) {
    const coinGroup = coins.slice(i * 3, (i + 1) * 3)
    const yangCount = coinGroup.filter(c => c === '正').length
    
    // 3正为老阳（动爻），2正1反为少阴，1正2反为少阳，3反为老阴（动爻）
    if (yangCount === 3) {
      yaoResults.push({ type: '老阳', value: 1, isMoving: true, symbol: '⚊' })
    } else if (yangCount === 2) {
      yaoResults.push({ type: '少阴', value: 1, isMoving: false, symbol: '⚊' })
    } else if (yangCount === 1) {
      yaoResults.push({ type: '少阳', value: 0, isMoving: false, symbol: '⚋' })
    } else {
      yaoResults.push({ type: '老阴', value: 0, isMoving: true, symbol: '⚋' })
    }
  }
  
  return generateGuaXiangFromYao(yaoResults)
}

/**
 * 时间起卦
 * @param {Date} date - 时间对象
 * @returns {object} 卦象信息
 */
export function divinationByTime(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  
  // 上卦：(年+月+日) % 8
  const upperIndex = ((year + month + day) % 8) || 8
  const upperGua = Object.values(BA_GUA)[upperIndex - 1]
  
  // 下卦：(年+月+日+时) % 8
  const lowerIndex = ((year + month + day + hour) % 8) || 8
  const lowerGua = Object.values(BA_GUA)[lowerIndex - 1]
  
  // 动爻：(年+月+日+时) % 6
  const movingYao = ((year + month + day + hour) % 6) || 6
  
  return generateGuaXiang(upperGua, lowerGua, movingYao)
}

/**
 * 随机起卦
 * @returns {object} 卦象信息
 */
export function divinationByRandom() {
  const num1 = Math.floor(Math.random() * 100) + 1
  const num2 = Math.floor(Math.random() * 100) + 1
  const num3 = Math.floor(Math.random() * 100) + 1
  
  return divinationByNumber(num1, num2, num3)
}

/**
 * 根据爻象生成卦象
 * @param {array} yaoResults - 爻象数组
 * @returns {object} 卦象信息
 */
function generateGuaXiangFromYao(yaoResults) {
  // 确定上下卦
  const upperYao = yaoResults.slice(3, 6).reverse()
  const lowerYao = yaoResults.slice(0, 3).reverse()
  
  const upperBinary = upperYao.map(y => y.value).join('')
  const lowerBinary = lowerYao.map(y => y.value).join('')
  
  const upperGua = BA_GUA[upperBinary]
  const lowerGua = BA_GUA[lowerBinary]
  
  // 确定动爻
  const movingYaos = yaoResults
    .map((y, index) => ({ ...y, position: 6 - index }))
    .filter(y => y.isMoving)
    .map(y => y.position)
  
  return generateGuaXiang(upperGua, lowerGua, movingYaos.length > 0 ? movingYaos[0] : 0, yaoResults)
}

/**
 * 生成卦象
 * @param {object} upperGua - 上卦
 * @param {object} lowerGua - 下卦
 * @param {number} movingYao - 动爻位置（1-6）
 * @param {array} yaoResults - 爻象数组（可选）
 * @returns {object} 完整的卦象信息
 */
function generateGuaXiang(upperGua, lowerGua, movingYao, yaoResults = null) {
  const guaName = upperGua.name + lowerGua.name
  const guaInfo = LIU_SHI_SI_GUA[guaName] || {
    symbol: '?',
    description: '卦象信息待补充',
    meaning: '请参考周易原文',
    yaoCi: ['', '', '', '', '', '']
  }
  
  // 生成本卦爻象
  const benGuaYao = yaoResults || generateYaoFromGua(upperGua, lowerGua)
  
  // 生成变卦
  const bianGuaYao = benGuaYao.map((yao, index) => {
    const position = 6 - index
    if (position === movingYao) {
      // 动爻变化：阳变阴，阴变阳
      return {
        ...yao,
        value: yao.value === 1 ? 0 : 1,
        symbol: yao.value === 1 ? '⚋' : '⚊',
        isMoving: false
      }
    }
    return yao
  })
  
  // 确定变卦的上下卦
  const bianUpperBinary = bianGuaYao.slice(0, 3).map(y => y.value).reverse().join('')
  const bianLowerBinary = bianGuaYao.slice(3, 6).map(y => y.value).reverse().join('')
  const bianUpperGua = BA_GUA[bianUpperBinary]
  const bianLowerGua = BA_GUA[bianLowerBinary]
  const bianGuaName = bianUpperGua.name + bianLowerGua.name
  
  // 计算六兽（根据日辰）
  const liuShou = calculateLiuShou()
  
  return {
    // 本卦信息
    benGua: {
      name: guaName,
      symbol: guaInfo.symbol,
      upper: upperGua,
      lower: lowerGua,
      yao: benGuaYao,
      description: guaInfo.description,
      meaning: guaInfo.meaning
    },
    // 变卦信息
    bianGua: {
      name: bianGuaName,
      upper: bianUpperGua,
      lower: bianLowerGua,
      yao: bianGuaYao
    },
    // 动爻信息
    dongYao: {
      position: movingYao,
      yaoCi: movingYao > 0 ? guaInfo.yaoCi[movingYao - 1] : '',
      meaning: getDongYaoMeaning(movingYao)
    },
    // 六兽
    liuShou: liuShou,
    // 卦辞
    guaCi: guaInfo.description,
    // 总体判断
    interpretation: generateInterpretation(guaName, movingYao, guaInfo)
  }
}

/**
 * 根据卦象生成爻
 * @param {object} upperGua - 上卦
 * @param {object} lowerGua - 下卦
 * @returns {array} 爻象数组
 */
function generateYaoFromGua(upperGua, lowerGua) {
  // 这里简化处理，实际应该根据卦象的二进制表示
  const upperBinary = Object.keys(BA_GUA).find(key => BA_GUA[key].name === upperGua.name)
  const lowerBinary = Object.keys(BA_GUA).find(key => BA_GUA[key].name === lowerGua.name)
  
  const yao = []
  
  // 上卦三爻（从下到上）
  for (let i = 2; i >= 0; i--) {
    const value = parseInt(upperBinary[i])
    yao.push({
      type: value === 1 ? '少阳' : '少阴',
      value: value,
      isMoving: false,
      symbol: value === 1 ? '⚊' : '⚋'
    })
  }
  
  // 下卦三爻（从下到上）
  for (let i = 2; i >= 0; i--) {
    const value = parseInt(lowerBinary[i])
    yao.push({
      type: value === 1 ? '少阳' : '少阴',
      value: value,
      isMoving: false,
      symbol: value === 1 ? '⚊' : '⚋'
    })
  }
  
  return yao
}

/**
 * 计算六兽
 * @returns {array} 六兽数组
 */
function calculateLiuShou() {
  // 简化处理，实际应根据日辰天干计算
  return LIU_SHOU
}

/**
 * 获取动爻含义
 * @param {number} position - 动爻位置
 * @returns {string} 含义说明
 */
function getDongYaoMeaning(position) {
  const meanings = {
    1: '初爻动，事情刚开始，宜谨慎',
    2: '二爻动，事情发展，小有进展',
    3: '三爻动，事情有变，需警惕',
    4: '四爻动，事情转折，机会出现',
    5: '五爻动，事情顺利，贵人相助',
    6: '上爻动，事情结束，宜总结'
  }
  return meanings[position] || ''
}

/**
 * 生成卦象解读
 * @param {string} guaName - 卦名
 * @param {number} dongYao - 动爻
 * @param {object} guaInfo - 卦象信息
 * @returns {object} 解读内容
 */
function generateInterpretation(guaName, dongYao, guaInfo) {
  const interpretations = {
    overall: `${guaName}卦，${guaInfo.description}。此卦${dongYao > 0 ? '有动爻，事情将有变化' : '静卦，宜守静待时'}。`,
    advice: dongYao > 0 
      ? `动爻在第${dongYao}爻，${guaInfo.yaoCi[dongYao - 1]}。建议根据变化调整策略。`
      : '卦象稳定，宜按原计划进行。',
    time: '近期内会有结果，具体时间视具体情况而定。',
    direction: '有利方向：' + (guaName.includes('东') ? '东方' : guaName.includes('南') ? '南方' : guaName.includes('西') ? '西方' : guaName.includes('北') ? '北方' : '中央')
  }
  
  return interpretations
}

/**
 * 根据问题类型提供具体建议
 * @param {string} questionType - 问题类型
 * @param {object} guaXiang - 卦象
 * @returns {string} 具体建议
 */
export function getAdviceByQuestionType(questionType, guaXiang) {
  const advices = {
    '事业': guaXiang.benGua.upper.attribute === '金' 
      ? '事业宜稳健发展，不可冒进。' 
      : '事业有发展机会，宜把握时机。',
    '感情': guaXiang.dongYao.position === 2 || guaXiang.dongYao.position === 5
      ? '感情运势良好，有望进展。'
      : '感情需要耐心经营，不宜急躁。',
    '财运': guaXiang.benGua.lower.attribute === '水'
      ? '财运流动，有进有出，宜理财。'
      : '财运平稳，宜守不宜攻。',
    '健康': guaXiang.benGua.upper.attribute === '火'
      ? '注意心脑血管健康，宜静养。'
      : '身体状况良好，保持规律作息。',
    '学业': guaXiang.dongYao.position === 1 || guaXiang.dongYao.position === 4
      ? '学业有进步，宜努力学习。'
      : '学业平稳，需持之以恒。',
    '出行': guaXiang.benGua.name.includes('坎')
      ? '出行需谨慎，注意安全。'
      : '出行顺利，一路平安。'
  }
  
  return advices[questionType] || '此事吉凶参半，宜谨慎行事。'
}

/**
 * 获取卦象详细信息
 * @param {string} guaName - 卦名
 * @returns {object} 卦象详细信息
 */
export function getGuaDetail(guaName) {
  return LIU_SHI_SI_GUA[guaName] || null
}

/**
 * 获取所有卦象列表
 * @returns {array} 卦象列表
 */
export function getAllGuaList() {
  return Object.keys(LIU_SHI_SI_GUA).map(name => ({
    name,
    ...LIU_SHI_SI_GUA[name]
  }))
}

export default {
  divinationByNumber,
  divinationByCoins,
  divinationByTime,
  divinationByRandom,
  getAdviceByQuestionType,
  getGuaDetail,
  getAllGuaList
}
