// components/indent-list/indent-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indent: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    info () {
      wx.navigateTo({
        url: "/pages/indent-info/indent-info",
        success: res => {
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.properties.indent })
        }
      })
    }
  }
})
