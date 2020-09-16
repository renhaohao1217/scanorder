//Page Object
Page({
  data: {
    address: '',
    phone: '',
    shop: '',
    username: '',
    image: '',
    region: [],
    _id: ''
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
            image: true,
            region: true,
          })
          .where({
            _id: _.eq(_id)
          })
          .get()
          .then(res => {
            let { address, phone, shop, username, _id, region } = res.data[0];
            let image = res.data[0].image || '/images/logo.svg'
            this.setData({
              address,
              phone,
              shop,
              username,
              image,
              _id,
              region
            })
          })
      }
    });
  },
  // 用户详细信息
  skip_shop () {
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
      success: res => {
        let { address, phone, shop, username, image, _id, region } = this.data;
        let data = {
          address, phone, shop, username, image, _id, region
        }
        res.eventChannel.emit('acceptDataFromOpenerPage', { data })
      }
    });
  },
  // 修改密码
  update_pwd () {
    let { _id } = this.data;
    wx.navigateTo({
      url: `/pages/update_pwd/update_pwd?_id=${_id}`,
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
  onShow: function () {
    this.init();
  }
});