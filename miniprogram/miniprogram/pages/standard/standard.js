//Page Object
Page({
  data: {
    goods: {
      image: '',
      name: '',
      price: '',
      classify: '',
      info: '',
      zero: false
    }
  },

  choose () {
    wx.chooseImage({
      count: 1,
      success: res => {
        // res.tempFiles[0].path
      }
    })
  },
  update (event) {
    console.log(event);
    let { key } = event.target.dataset;
    let value = event.detail.value;
    let goods = this.data.goods;
    goods[key] = value;
    this.setData({
      goods
    })
  },
  //options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});