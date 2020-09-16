Page({
  // 页面的初始数据
  data: {
    _id: '',
    prevpassword: '',
    password: '',
    repassword: '',
    change: {
      prevpassword: false,
      password: false,
      repassword: false
    }
  },
  // 验证数据格式
  check (event) {
    let { value } = event.detail;
    let { target } = event.target.dataset;
    let { prevpassword, password, repassword, _id } = this.data;
    // 提示信息
    let message = {
      prevpassword: '原密码',
      password: '新密码',
      repassword: '确认密码'
    }
    if (!/^[a-zA-Z0-9_-]{6,20}$/.test(value)) {
      wx.showToast({
        title: `${message[target]}格式不正确`,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 验证原密码是否输入正确
    if (target == 'prevpassword') {
      wx.cloud.database()
        .collection('so_shop')
        .doc(_id)
        .field({
          password: true,
          _id: false
        })
        .get()
        .then(res => {
          if (value !== res.data.password) {
            wx.showToast({
              title: `原密码输入错误`,
              icon: 'none',
              duration: 2000
            })
          } else {
            this.setData({
              prevpassword: value,
              'change.prevpassword': true
            })
          }
          return;
        })
    }
    // 验证新密码和旧密码是否一样
    if (target == 'password') {
      if (value === prevpassword) {
        wx.showToast({
          title: `新密码和原密码不能一样`,
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({
          password: value,
          'change.password': true
        })
      }
      return;
    }
    // 验证两次密码输入是否一致
    if (target == 'repassword') {
      if (password !== value) {
        wx.showToast({
          title: `确认密码输入不一致`,
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({
          repassword: value,
          'change.repassword': true
        })
      }
      return;
    }
  },
  // 提交
  submit () {
    let { change, _id, password } = this.data;
    // 判断数据输入是否有误
    for (let key in change) {
      if (!change[key]) {
        let message = {
          prevpassword: '原密码',
          password: '新密码',
          repassword: '确认密码'
        }
        wx.showToast({
          title: `${message[key]}输入不正确`,
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    wx.cloud.database()
      .collection('so_shop')
      .doc(_id)
      .update({
        data: {
          password
        },
        success: res => {
          if (!!res.stats.updated) {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            wx.reLaunch({
              url: '/pages/index/index'
            })
            wx.removeStorageSync('_id');
          } else {
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      _id: options._id
    })
  }
})