//Page Object
Page({
  data: {
    task_arr: []
  },
  //options(Object)
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'lookup_cart',
      data: {
        collection: 'so_task',
        from: 'so_order',
        localField: 'order_id',
        foreignField: '_id',
        as: 'orderList',
        match: {
          shop_id: wx.getStorageSync('_id')
        }
      },
      success: res => {
        console.log(res.result.list);
        this.setData({
          task_arr: res.result.list
        })
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});