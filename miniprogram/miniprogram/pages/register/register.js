// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    repassword: '',
    phone: '',
    shop: '',
    address: '',
    focus: {
      username: false,
      password: false,
      repassword: false,
      phone: false,
      shop: false,
      address: false
    },
    format: {
      username: false,
      password: false,
      repassword: false,
      phone: false,
      shop: false,
      address: false
    }
  },

  /**
   * 自定义方法
   */
  input_model (event) {
    let target = event.target.dataset.target;
    this.setData({
      [target]: event.detail.value
    })
  },
  toast (event) {
    let target = event.target.dataset.target;
    let { focus, format } = this.data;
    focus[target] = true;
    format[target] = false;
    this.setData({
      focus,
      format
    })
  },
  check (event) {
    let target = event.target.dataset.target;
    let { username, password, repassword, phone, shop, address, focus, format } = this.data;
    let hash = {
      username: !/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(username),
      phone: !/^1[3456789]\d{9}$/.test(phone),
      shop: shop.length == 0,
      address: address.length == 0,
      password: !/^[a-zA-Z0-9_-]{6,20}$/.test(password),
      repassword: password != repassword
    }
    focus[target] = false;
    format[target] = hash[target];
    this.setData({
      focus,
      format
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