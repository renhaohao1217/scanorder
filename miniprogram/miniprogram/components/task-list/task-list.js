// components/task-list/task-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
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
    toggle (event) {
      let { index } = event.currentTarget.dataset;
      let { item } = this.data;
      item.state[index] = !item.state[index];
      this.setData({
        item
      })
      for (let val of item.state) {
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
            // 从数据库中删除任务
            wx.cloud.database()
              .collection('so_task')
              .doc(item._id)
              .remove();
            this.triggerEvent('remove', { _id: item._id })
          }
        }
      });
    }
  }
})