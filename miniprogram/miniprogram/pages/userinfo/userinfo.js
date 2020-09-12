//Page Object
Page({
  data: {
    address: '',
    image: '',
    phone: '',
    shop: '',
    username: '',
    _id: ''
  },
  // 自定义方法
  // 更新头像方法
  update_image () {
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
            // console.log('上传成功', res.fileID)
            this.setData({
              image: res.fileID
            })
            const db = wx.cloud.database();
            const _ = db.command;
            db.collection('so_shop')
              .doc(this.data._id)
              .update({
                data: {
                  image: res.fileID
                }
              })
          },
        })
      },
    })
  },
  // 双向数据绑定方法
  input_model (event) {
    let { target } = event.target.dataset;
    this.setData({
      [target]: event.detail.value
    })
  },
  // 检查数据方法
  check (event) {
    let { target } = event.target.dataset;
    let { username, phone, shop, address } = this.data;
    let hash = {
      username: !/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(username),
      phone: !/^1[3456789]\d{9}$/.test(phone),
      shop: shop.length == 0,
      address: address.length == 0
    }
    // 错误信息
    let message = {
      username: '用户名格式不正确',
      phone: '手机号格式不正确',
      shop: '店铺名称不能为空',
      address: '店铺地址不能为空'
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
    const db = wx.cloud.database();
    const _ = db.command;
    if (target == 'username' || target == 'phone') {
      db.collection('so_shop')
        .where({
          [target]: _.eq(this.data[target])
        })
        .get({
          success: res => {
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
              this.update(target);
            }
          }
        })
    } else {
      // 更新数据
      this.update(target);
    }
  },
  // 更新数据
  update (target) {
    wx.cloud.database()
      .collection('so_shop')
      .doc(this.data._id)
      .update({
        data: {
          [target]: this.data[target]
        },
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
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data => {
      let { address, image, phone, shop, username, _id } = data.data;
      this.setData({
        address, image, phone, shop, username, _id
      })
    })
  }
});