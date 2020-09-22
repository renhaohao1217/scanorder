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
    wx.cloud.database()
      .collection('so_shop')
      .doc(wx.getStorageSync('_id'))
      .field({
        address: true,
        phone: true,
        shop: true,
        username: true,
        image: true,
        region: true,
      })
      .get()
      .then(res => {
        let { address, phone, shop, username, _id, region } = res.data;
        let image = res.data.image || '/images/logo.svg'
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
  },
  // 用户详细信息
  skip_shop () {
    wx.navigateTo({
      url: `/pages/userinfo/userinfo?data=${JSON.stringify(this.data)}`
    });
  },
  // 二维码餐牌
  serial () {
    wx.navigateTo({
      url: '/pages/serial/serial'
    })
  },
  // 报表信息
  report () {
    wx.navigateTo({
      url: '/pages/report/report'
    })
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