App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'zhima-zaczd',
        traceUser: true,
      })
    }
    // 获取手机可使用窗口高度、状态栏高度、客户端平台
    const { windowHeight, statusBarHeight, platform } = wx.getSystemInfoSync()
    // 获取胶囊按钮距离顶部的距离和高度
    const { top, height } = wx.getMenuButtonBoundingClientRect()
    // 状态栏高度
    wx.setStorageSync('statusBarHeight', statusBarHeight)
    // 胶囊按钮高度 一般是32 如果获取不到就使用32
    wx.setStorageSync('menuButtonHeight', height ? height : 32)
    // 屏幕高度
    wx.setStorageSync('windowHeight', windowHeight)
    // 判断胶囊按钮信息是否成功获取
    if (top && top !== 0 && height && height !== 0) {
      const navigationBarHeight = (top - statusBarHeight) * 2 + height
      // 导航栏高度
      wx.setStorageSync('navigationBarHeight', navigationBarHeight)
    } else {
      wx.setStorageSync(
        'navigationBarHeight',
        platform === 'android' ? 48 : 40
      )
    }
    // 全局data对象
    this.globalData = {}
    // 判断是否是登录状态
    // if (wx.getStorageSync('_id')) {
    //   wx.reLaunch({
    //     url: '/pages/order/order'
    //   });
    // }
  }
})
