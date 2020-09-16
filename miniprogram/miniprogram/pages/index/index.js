//Page Object
Page({
  // 页面的初始数据
  data: {

  },
  // 自定义方法
  skip (event) {
    let { method } = event.target.dataset;
    wx.navigateTo({
      url: `/pages/${method}/${method}`,
    })
  },
  // 调用扫码
  scan () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        console.log(res);
        wx.navigateTo({
          url: res.result
        })
      }
    })
  }
});