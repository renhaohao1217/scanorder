//Page Object
Page({
  // 页面的初始数据
  data: {

  },
  // 自定义方法
  skip (event) {
    let { method } = event.target.dataset;
    wx.navigateTo({
      url: `/pages/${method}/${method}`,
    })
  }
});