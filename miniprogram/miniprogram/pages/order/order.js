Page({
  // 页面的初始数据
  data: {},
  // 跳转到点餐界面
  order (event) {
    let { method } = event.currentTarget.dataset;
    let hash = {
      table: ['桌位1', '桌位2', '桌位3', '桌位4', '桌位5', '桌位6'],
      serial: ['流水1', '流水2', '流水3', '流水4', '流水5', '流水6']
    }
    wx.showActionSheet({
      itemList: hash[method],
      success (res) {
        wx.navigateTo({
          url: `/pages/business/business?method=${method}&order=${hash[method][res.tapIndex]}`
        })
      }
    })
  }
})