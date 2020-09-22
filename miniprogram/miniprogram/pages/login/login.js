Page({
  // 页面的初始数据
  data: {
    username: '',
    password: ''
  },
  // 输入框失去焦点时更改数据
  blur (event) {
    // 获取输入框类型
    let { type } = event.target.dataset;
    this.setData({
      [type]: event.detail.value
    })
  },
  // 登录验证
  login () {
    let { username, password } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
    // 验证用户名 / 手机号 是否和密码相同
    db.collection('so_shop')
      .where(_.or([
        {
          username: _.eq(username),
          password: _.eq(password)
        },
        {
          phone: _.eq(username),
          password: _.eq(password)
        }
      ]))
      .get()
      .then(res => {
        if (!!res.data.length) {
          // 将登录状态缓存到本地
          let { _id } = res.data[0];
          wx.setStorageSync('_id', _id)
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/order/order'
          })
        } else {
          wx.showToast({
            title: '账号或者密码错误',
            icon: 'none',
            duration: 2000,
          })
        }
      })
  }
})