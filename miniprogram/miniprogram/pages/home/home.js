//Page Object
Page({
  data: {
    address: '',
    phone: '',
    shop: '',
    username: '',
    image: '',
    _id: ''
  },
  // 自定义方法
  skip_shop () {
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
      success: res => {
        let { address, phone, shop, username, image, _id } = this.data;
        let data = {
          address, phone, shop, username, image, _id
        }
        res.eventChannel.emit('acceptDataFromOpenerPage', { data })
      }
    });
  },
  // 初始化获取数据
  init () {
    wx.getStorage({
      key: '_id',
      success: (result) => {
        const _id = result.data;
        const db = wx.cloud.database();
        const _ = db.command;
        db.collection('so_shop')
          .field({
            address: true,
            phone: true,
            shop: true,
            username: true,
            image: true
          })
          .where({
            _id: _.eq(_id)
          })
          .get({
            success: res => {
              let { address, phone, shop, username, _id } = res.data[0];
              let image = res.data[0].image || '/images/logo.svg'
              this.setData({
                address,
                phone,
                shop,
                username,
                image,
                _id
              })
            }
          })
      }
    });
  },
  // 修改密码
  update_pwd () {
    wx.navigateTo({
      url: '/pages/update_pwd/update_pwd',
      success: res => {
        let { _id } = this.data;
        let data = {
          _id
        }
        res.eventChannel.emit('acceptDataFromOpenerPage', { data })
      }
    });
  },
  // 退出登录
  exit () {
    wx.showModal({
      content: '确定退出吗?下次登录依然可以使用本账号',
      confirmText: '退出',
      confirmColor: '#ff3333',
      success (res) {
        // 用户点了确定
        if (res.confirm) {
          wx.removeStorage({
            key: '_id',
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  //options(Object)
  onLoad: function (options) {
    this.init();
  },
  onShow: function () {
    this.init();
  }
});