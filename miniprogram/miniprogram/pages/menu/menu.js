// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})