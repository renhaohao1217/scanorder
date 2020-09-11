Page({
  // 页面的初始数据
  data: {

  },
  // 自定义方法
  order (event) {
    let { method } = event.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/business/business',
      success: res => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { method })
      }
    })
  }
})