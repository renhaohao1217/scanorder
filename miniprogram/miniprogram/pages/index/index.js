//Page Object
Page({
  // 页面的初始数据
  data: {
    shops: []
  },
  // 跳转到登录 / 注册页面
  skip (event) {
    let { method } = event.target.dataset;
    wx.navigateTo({
      url: `/pages/${method}/${method}`,
    })
  },
  // 开始点餐
  order (event) {
    let { index } = event.currentTarget.dataset;
    let { shops } = this.data;
    wx.navigateTo({
      url: `/pages/business/business?method=table&shop_id=${shops[index]._id}`
    })
  },
  onLoad () {
    // 获取商家信息
    wx.cloud.database()
      .collection('so_shop')
      .get()
      .then(res => {
        this.setData({
          shops: res.data
        })
      })
  }
});