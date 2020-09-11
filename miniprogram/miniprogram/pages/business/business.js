Page({
  // 页面的初始数据
  data: {
    method: '桌位号点餐',
    // 导航栏和状态栏高度
    height:
      wx.getStorageSync('windowHeight') -
      wx.getStorageSync('statusBarHeight') -
      wx.getStorageSync('navigationBarHeight') +
      'px',
    num: 0,
    sum: 0.00,
    result: [
      {
        title: '商品分类',
        child: [
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
          { id: '商品分类', title: '菜品名称', price: 66.66, num: 0 },
        ]
      },
      {
        title: '饮品',
        child: [
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
          { id: '饮品', title: '饮品', price: 66.66, num: 0 },
        ]
      },
      {
        title: '饮品2',
        child: [
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
          { id: '饮品2', title: '饮品2', price: 66.66, num: 0 },
        ]
      }
    ]
  },
  // 自定义函数
  myevent (event) {
    console.log(event);
    let { num, sum } = event.detail;
    this.setData({
      num,
      sum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      // console.log(data.method)
    })
  }
})