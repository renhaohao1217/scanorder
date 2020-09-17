const computedBehavior = require('../../miniprogram_npm/miniprogram-computed/index')
Component({
  behaviors: [computedBehavior],
  // 传入属性
  properties: {
    info: {
      type: Object,
      value: {}
    }
  },
  // 初始数据
  data: {},
  // 计算属性
  computed: {
    sum (data) {
      if (data.info.amount) {
        return parseFloat(data.info.amount * data.info.goodsList[0].price).toFixed(2)
      }
    }
  }
})
