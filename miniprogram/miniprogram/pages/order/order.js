Page({
  // 页面的初始数据
  data: {
    table: [],
    serial: []
  },
  // 跳转到点餐界面
  order (event) {
    let { method } = event.currentTarget.dataset;
    let { table, serial } = this.data;
    let hash = {
      table,
      serial
    }
    wx.showActionSheet({
      itemList: hash[method],
      success (res) {
        wx.navigateTo({
          url: `/pages/business/business?method=${method}&order=${hash[method][res.tapIndex]}&shop_id=${wx.getStorageSync('_id')}`
        })
      }
    })
  },
  onLoad () {
    let { table, serial } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('so_serial')
      .where({
        shop_id: _.eq(wx.getStorageSync('_id'))
      })
      .get()
      .then(res => {
        for (let val of res.data) {
          if (val.type == 'table') {
            table.push(val.value)
          } else {
            serial.push(val.value)
          }
        }
      })
  }
})