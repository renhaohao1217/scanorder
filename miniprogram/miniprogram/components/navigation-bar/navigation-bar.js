Component({
  data: {
    // 状态栏高度
    statusBarHeight: wx.getStorageSync('statusBarHeight') + 'px',
    // 导航栏高度
    navigationBarHeight: wx.getStorageSync('navigationBarHeight') + 'px',
    // 胶囊按钮高度
    menuButtonHeight: wx.getStorageSync('menuButtonHeight') + 'px',
    // 导航栏和状态栏高度
    navigationBarAndStatusBarHeight:
      wx.getStorageSync('statusBarHeight') +
      wx.getStorageSync('navigationBarHeight') +
      'px'
  },
  properties: {
    img_source: {
      type: String,
      value: '/images/main.png'
    },
    title: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: 'home'
    }
  },
  methods: {
    back () {
      if (this.properties.icon == 'home') {
        wx.reLaunch({
          url: '/pages/home/home'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }

    }
  }
})