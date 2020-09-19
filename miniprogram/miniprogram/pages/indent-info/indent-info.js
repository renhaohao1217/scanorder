Page({
  // 页面的初始数据
  data: {
    cart_arr: [],
    sum: '',
    order: '',
    time: '',
    _id: ''
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let { cart_arr, sum, order, _id } = options;
    let time = Date.now();
    cart_arr = JSON.parse(cart_arr);
    this.setData({
      cart_arr,
      sum, order, time
    })
    wx.cloud.database()
      .collection('so_order')
      .add({
        data: {
          classify: order,
          state: '待支付',
          time,
          goods: cart_arr,
          shop_id: _id
        }
      })
      .then(res => {
        this.setData({
          _id: res._id
        })
        wx.cloud.database()
          .collection('so_task')
          .add({
            data: {
              order_id: res._id,
              shop_id: cart_arr[0].goodsList[0].shop_id
            }
          })
      })
  }
})