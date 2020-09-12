Page({
  // 页面的初始数据
  data: {
    _id: '',
    prevpassword: '',
    password: '',
    repassword: '',
    flag: false
  },
  // 双向数据绑定
  input_model (event) {
    let { target } = event.target.dataset;
    this.setData({
      [target]: event.detail.value
    })
  },
  check (event) {
    this.setData({
      flag: false
    })
    const db = wx.cloud.database();
    const _ = db.command;
    let { target } = event.target.dataset;
    let { prevpassword, password, repassword } = this.data;
    let message = {
      prevpassword: '原密码',
      password: '新密码',
      repassword: '确认密码'
    }
    if (!/^[a-zA-Z0-9_-]{6,20}$/.test(this.data[target])) {
      wx.showToast({
        title: `${message[target]}格式不正确`,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 验证原密码是否输入正确
    if (target == 'prevpassword') {
      db.collection('so_shop')
        .doc(this.data._id)
        .field({
          password: true,
          _id: false
        })
        .get({
          success: res => {
            if (prevpassword !== res.data.password) {
              wx.showToast({
                title: `原密码输入错误`,
                icon: 'none',
                duration: 2000
              })
              return;
            }
          }
        })
    }
    // 验证新密码和旧密码是否一样
    if (target == 'password' && password === prevpassword) {
      wx.showToast({
        title: `新密码和原密码不能一样`,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 验证两次密码输入是否一致
    if (target == 'repassword' && password !== repassword) {
      wx.showToast({
        title: `确认密码输入不一致`,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 密码输入正确
    this.setData({
      flag: true
    })
  },
  // 提交
  submit () {
    if (this.data.flag) {
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('so_shop')
        .doc(this.data._id)
        .update({
          data: {
            password: this.data.password
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
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 获取从home组件传递过来的数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data => {
      let { _id } = data.data;
      this.setData({
        _id
      })
    })
  }
})