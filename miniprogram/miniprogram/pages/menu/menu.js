Page({
  //  页面的初始数据
  data: {
    height:
      wx.getStorageSync('windowHeight') -
      wx.getStorageSync('statusBarHeight') -
      wx.getStorageSync('navigationBarHeight') - 50 + 'px',
    classify_arr: [],
    goods_arr: []
  },
  onShow () {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('so_classify')
      .where({
        shop_id: _.eq(wx.getStorageSync("_id"))
      })
      .orderBy('time', 'asc')
      .get()
      .then(res => {
        this.setData({
          classify_arr: res.data
        })
        // 获取分类对应的商品
        !!res.data.length && db.collection('so_goods')
          .where({
            classify_id: _.eq(res.data[0]._id)
          })
          .orderBy('sale', 'asc')
          .orderBy('time', 'asc')
          .get()
          .then(res => {
            this.setData({
              goods_arr: res.data
            })
          })
      })
  }
})
