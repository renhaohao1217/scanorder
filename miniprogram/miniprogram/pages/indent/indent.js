//Page Object
Page({
  data: {
    indent: [],
    date: '2020-09-19',
    today: '',
    watcher: ''
  },
  // 改变日期
  bindDateChange (e) {
    this.setData({
      date: e.detail.value
    })
    let left = new Date(`${e.detail.value} 00:00:00`).getTime(),
      right = parseInt(left) + 86400000;
    this.getIndent(left, right);
  },
  // 获取数据
  getIndent (left, right) {
    // 实时数据更新
    let { watcher } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
    watcher = db.collection('so_order')
      .orderBy('time', 'desc')
      .where({
        shop_id: _.eq(wx.getStorageSync('_id')),
        time: _.and(_.gt(left), _.lt(right))
      })
      .watch({
        onChange: (snapshot) => {
          this.setData({
            indent: snapshot.docs
          })
        },
        onError: (err) => {
          console.error('the watch closed because of error', err)
        }
      })
    this.setData({
      watcher
    })
  },
  //options(Object)
  onLoad: function (options) {
    // 设置年月日
    let date = new Date();
    let year = date.getFullYear(),
      month = (date.getMonth() + 1 + '').padStart(2, '0'),
      day = (date.getDate() + '').padStart(2, '0');
    this.setData({
      date: `${year}-${month}-${day}`,
      today: `${year}-${month}-${day}`
    })
    let left = new Date(`${year}-${month}-${day} 00:00:00`).getTime(),
      right = parseInt(left) + 86400000;
    this.getIndent(left, right);
  },
  onUnload: function () {
    // 关闭数据监听
    let { watcher } = this.data;
    watcher.close();
  }
});