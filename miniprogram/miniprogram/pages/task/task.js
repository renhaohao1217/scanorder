//Page Object
Page({
  data: {
    task_arr: [],
    watcher: ''
  },
  // 移除任务
  remove (event) {
    let { _id } = event.detail;
    let { task_arr } = this.data;
    for (let i in task_arr) {
      if (task_arr[i]._id == _id) {
        task_arr.splice(i, 1);
        break;
      }
    }
    this.setData({
      task_arr
    })
  },
  //options(Object)
  onLoad: function (options) {
    let { watcher } = this.data;
    // 实时数据更新
    const db = wx.cloud.database();
    const _ = db.command;
    watcher = db.collection('so_task')
      .where({
        shop_id: _.eq(wx.getStorageSync('_id'))
      })
      .watch({
        onChange: () => {
          // 联表查询so_task和so_order
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
              this.setData({
                task_arr: res.result.list
              })
            }
          })
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    this.setData({
      watcher
    })
  },
  onUnload: function () {
    // 关闭数据监听
    let { watcher } = this.data;
    watcher.close();
  },
});