// pages/register/register.js
Page({
  // 初始化数据
  data: {
    username: '',
    password: '',
    repassword: '',
    phone: '',
    shop: '',
    address: '',
    focus: {
      username: false,
      password: false,
      repassword: false,
      phone: false,
      shop: false,
      address: false
    },
    format: {
      username: false,
      password: false,
      repassword: false,
      phone: false,
      shop: false,
      address: false
    },
    registered: {
      username: false,
      password: false,
      repassword: false,
      phone: false,
      shop: false,
      address: false
    }
  },
  // 自定义方法
  input_model (event) {
    let target = event.target.dataset.target;
    this.setData({
      [target]: event.detail.value
    })
  },
  toast (event) {
    let target = event.target.dataset.target;
    let { focus, format, registered } = this.data;
    focus[target] = true;
    format[target] = false;
    registered[target] = false;
    this.setData({
      focus,
      format,
      registered
    })
  },
  check (event) {
    let { target } = event.target.dataset;
    let { username, password, repassword, phone, shop, address, focus, format, registered } = this.data;
    let hash = {
      username: !/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(username),
      phone: !/^1[3456789]\d{9}$/.test(phone),
      shop: shop.length == 0,
      address: address.length == 0,
      password: !/^[a-zA-Z0-9_-]{6,20}$/.test(password),
      repassword: password != repassword
    }
    focus[target] = false;
    format[target] = hash[target];
    this.setData({
      focus,
      format
    })
    // 判断用户名和手机号是否已经被注册
    const db = wx.cloud.database();
    const _ = db.command;
    if (!hash.username || !hash.phone) {
      db.collection('so_shop')
        .where({
          [target]: _.eq(this.data[target])
        })
        .get({
          success: res => {
            registered[target] = !!res.data.length;
            this.setData({
              registered
            })
          }
        })
    }
  },
  register () {
    let { username, password, phone, shop, address, format, registered } = this.data;
    // 如果信息不正确，返回
    for (let key in format) {
      if (format[key]) {
        wx.showToast({
          title: '信息格式不正确',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
    }
    for (let key in registered) {
      if (registered[key]) {
        wx.showToast({
          title: '信息格式不正确',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
    }
    // 将数据添加到集合中
    const db = wx.cloud.database();
    db.collection('so_shop').add({
      data: {
        username,
        password,
        phone,
        shop,
        address
      },
      success: res => {
        if (!!res._id) {
          wx.showToast({
            title: '注册成功',
            icon: 'none',
            duration: 2000,
          })
          // 返回首页
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '注册失败',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  }
})