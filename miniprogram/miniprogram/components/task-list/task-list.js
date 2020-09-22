Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {},
  methods: {
    toggle (event) {
      let { index } = event.currentTarget.dataset;
      let { item } = this.data;
      item.state[index] = !item.state[index];
      this.setData({
        item
      })
      // 更新数据库
      wx.cloud.database()
        .collection('so_task')
        .doc(item._id)
        .update({
          data: {
            state: item.state
          }
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