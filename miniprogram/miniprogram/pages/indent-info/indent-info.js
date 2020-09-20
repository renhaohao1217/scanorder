//Page Object
Page({
  data: {
    indent: {},
    sum: 0
  },
  // 支付
  pay () {
    let { indent } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('so_order')
      .doc(indent._id)
      .update({
        data: {
          state: '已支付'
        },
        success: res => {
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            'indent.state': '已支付'
          })
        }
      })
  },
  //options(Object)
  onLoad: function (options) {
    let { indent } = options;
    let { sum } = this.data;
    indent = JSON.parse(indent);
    for (let item of indent.goods) {
      sum += item.amount * item.goodsList[0].price
    }
    this.setData({
      indent,
      sum: parseFloat(sum).toFixed(2)
    })
  }
});