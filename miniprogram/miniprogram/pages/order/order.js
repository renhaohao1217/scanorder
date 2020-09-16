Page({
  // 页面的初始数据
  data: {},
  // 跳转到点餐界面
  order (event) {
    let { method } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/business/business?method=${method}`
    })
  }
})