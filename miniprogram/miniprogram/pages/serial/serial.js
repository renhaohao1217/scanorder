//Page Object
Page({
  data: {
    hidden: true,
    type: 'table',
    value: '',
    result: []
  },
  // 失去焦点
  blur (event) {
    let { value } = event.detail;
    this.setData({
      value
    })
  },
  // 取消按钮
  cancel () {
    this.setData({
      hidden: true,
      value: ''
    })
  },
  // 添加
  add () {
    let { value, type } = this.data;
    if (value == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.cloud.database()
      .collection('so_serial')
      .add({
        data: {
          type,
          value,
          shop_id: wx.getStorageSync('_id')
        }
      })
      .then(() => {
        this.getResult();
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          value: '',
          hidden: true
        })
      })
  },
  // 将输入框展示出来
  show (event) {
    let { type } = event.currentTarget.dataset;
    this.setData({
      type,
      hidden: false
    })
  },
  // 获取数据
  getResult () {
    // 从数据库中取出数据
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('so_serial')
      .orderBy('type', 'asc')
      .orderBy('value', 'asc')
      .where({
        shop_id: _.eq(wx.getStorageSync('_id'))
      })
      .get()
      .then(res => {
        this.setData({
          result: res.data
        })
      })
  },
  //options(Object)
  onLoad: function (options) {
    this.getResult();
  }
});