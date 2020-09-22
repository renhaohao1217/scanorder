//Page Object
Page({
  data: {
    address: '',
    image: '',
    phone: '',
    shop: '',
    username: '',
    _id: '',
    region: [],
    change: {
      address: false,
      image: false,
      phone: false,
      shop: false,
      username: false,
      region: false
    }
  },
  // 更新头像方法
  update_image () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `${Date.now()}-${parseInt(Math.random() * 65535)}.png`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            this.setData({
              image: res.fileID,
              'change.image': true
            })
          },
        })
      },
    })
  },
  // 检查数据方法
  check (event) {
    let { value } = event.detail;
    let { target } = event.target.dataset;
    let { change } = this.data;
    let hash = {
      username: !/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(value),
      phone: !/^1[3456789]\d{9}$/.test(value),
      shop: value.length == 0,
      address: value.length == 0
    }
    // 错误信息
    let message = {
      username: '用户名格式不正确',
      phone: '手机号格式不正确',
      shop: '店铺名称不能为空',
      address: '详细地址不能为空'
    }
    // 如果格式不正确，返回函数
    if (hash[target]) {
      wx.showToast({
        title: message[target],
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 判断用户名和手机号是否已经被注册
    if (target == 'username' || target == 'phone') {
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('so_shop')
        .where({
          [target]: _.eq(value)
        })
        .get()
        .then(res => {
          // 用户名或者手机号被注册
          if (!!res.data.length) {
            wx.showToast({
              title: `该${target == 'username' ? '用户名' : '手机号'}已经被注册`,
              icon: 'none',
              duration: 2000
            })
            return;
          } else {
            // 更新数据
            change[target] = true
            this.setData({
              [target]: value,
              change
            })
          }
        })
    } else {
      // 更新数据
      change[target] = true
      this.setData({
        [target]: value,
        change
      })
    }
  },
  // 地址选择器
  bindRegionChange (e) {
    this.setData({
      region: e.detail.value,
      'change.region': true
    })
  },
  // 转换地区信息格式
  transform (str) {
    let reg = /[市省区州县0-9A-Za-z]/g;
    let index1 = reg.exec(str).index + 1;
    let index2 = reg.exec(str).index + 1;
    let index3 = reg.exec(str).index + 1;
    return [
      str.slice(0, index1),
      str.slice(index1, index2),
      str.slice(index2, index3)
    ];
  },
  // 获取定位信息
  location () {
    // 引入SDK核心类
    const QQMapWX = require('../../utils/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js')
    // 实例化API核心类
    const wxMap = new QQMapWX({
      key: 'DJ4BZ-JPUW5-WTUII-QJ6JK-I4HE7-VJFSJ'
    });
    // 获取定位信息
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        //经纬度逆解析开始
        wxMap.reverseGeocoder({
          location: {
            // 你的经纬度
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: res => {
            this.setData({
              region: this.transform(res.result.address),
              'change.region': true
            })
          }
        })
      }
    })
  },
  // 保存修改
  save () {
    let { change, _id } = this.data;
    let data = {};
    // 判断哪些值发生了改变
    for (let key in change) {
      if (change[key]) {
        data[key] = this.data[key]
      }
    }
    // 更新数据库
    wx.cloud.database()
      .collection('so_shop')
      .doc(_id)
      .update({
        data,
        // 提示是否修改成功
        success: res => {
          if (!!res.stats.updated) {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
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
  //options(Object)
  onLoad: function (options) {
    // 获取从home组件传递过来的数据
    let { address, image, phone, shop, username, _id, region } = JSON.parse(options.data);
    this.setData({
      address, image, phone, shop, username, _id, region
    })
  }
});