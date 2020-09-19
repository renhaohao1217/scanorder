// components/task-list/task-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
    end: {
      type: Array,
      value: []
    },
    result: {
      type: Array,
      value: []
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
    toggle (event) {
      let { index } = event.target.dataset;
      let { result, end } = this.data;
      result[index] = !result[index]
      end[this.data.index] = result;
      this.setData({
        result,
        end
      })
      this.triggerEvent('update', { end })
      for (let val of result) {
        if (val) {
          return;
        }
      }
      wx.showModal({
        title: '提示',
        content: '该任务全部完成,是否移除该任务',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '移除',
        confirmColor: '#f33',
        success: (result) => {
          if (result.confirm) {
            this.triggerEvent('remove', { index: this.data.index })
          }
        }
      });
    }
  }
})