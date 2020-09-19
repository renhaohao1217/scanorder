//Page Object
Page({
  data: {
    task_arr: [],
    end: []
  },
  // 更新数据
  update (event) {
    this.setData({
      end: event.detail.end
    })
  },
  // 移除任务
  remove (event) {
    let { index } = event.detail;
    let { task_arr, end } = this.data;
    // 删除数据库
    wx.cloud.database()
      .collection('so_task')
      .doc(task_arr[index]._id)
      .remove()
    task_arr.splice(index, 1);
    end.splice(index, 1);
    this.setData({
      task_arr,
      end
    })
  },
  //options(Object)
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'lookup_cart',
      data: {
        collection: 'so_task',
        from: 'so_order',
        localField: 'order_id',
        foreignField: '_id',
        as: 'orderList',
        match: {
          shop_id: wx.getStorageSync('_id')
        }
      },
      success: res => {
        let end = [];
        for (let item of res.result.list) {
          let hash = new Array(item.orderList[0].goods.length).fill(true);
          end.push(hash);
        }
        this.setData({
          task_arr: res.result.list,
          end
        })
      }
    })
  }
});