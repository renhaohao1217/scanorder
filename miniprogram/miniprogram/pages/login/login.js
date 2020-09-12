// pages/login/login.js
Page({
  // 页面的初始数据
  data: {
    username: 'a11111',
    password: 'a11111'
  },
  // 自定义方法
  input_model (event) {
    let { type } = event.target.dataset;
    this.setData({
      [type]: event.detail.value
    })
  },
  login () {
    let { username, password } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
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
      .get({
        success: res => {
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
              url: '/pages/home/home'
            })
          } else {
            wx.showToast({
              title: '账号或者密码错误',
              icon: 'none',
              duration: 2000,
            })
          }
        }
      })
  }
})