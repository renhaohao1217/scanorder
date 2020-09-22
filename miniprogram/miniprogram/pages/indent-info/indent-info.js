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
    db.collection('so_order')
      .doc(indent._id)
      .update({
        data: {
          state: '已支付'
        },
        success: () => {
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            'indent.state': '已支付'
          })
          // 新建任务，添加到数据库中
          let state = new Array(indent.goods.length).fill(true);
          wx.cloud.database()
            .collection('so_task')
            .add({
              data: {
                order_id: indent._id,
                shop_id: indent.goods[0].goodsList[0].shop_id,
                state
              }
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