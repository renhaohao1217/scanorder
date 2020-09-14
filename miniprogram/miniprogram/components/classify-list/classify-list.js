// components/classify-list/classify-list.js
Component({
  properties: {
    source: {
      type: String,
      value: 'user'
    },
    classify_arr: {
      type: Array,
      value: []
    },
    goods_arr: {
      type: Array,
      value: []
    }
  },
  // 初始数据
  data: {
    hidden: true,
    classify: '',
    active: 0,
    classify_down: '/images/down.png',
    classify_up: '/images/up.png',
    goods_down: '/images/down.png',
    goods_up: '/images/up.png',
    num: 0,
    sum: 0
  },
  // 方法列表
  methods: {
    // 同步数据
    input_model (e) {
      this.setData({
        classify: e.detail.value
      })
    },
    // 切换商品分类
    select (event) {
      let { index } = event.currentTarget.dataset;
      let { classify_arr } = this.properties;
      const db = wx.cloud.database();
      const _ = db.command;
      // 获取分类对应的商品
      db.collection('so_goods')
        .where({
          classify_id: _.eq(classify_arr[index]._id)
        })
        .orderBy('time', 'asc')
        .get()
        .then(res => {
          this.setData({
            goods_arr: res.data,
            active: index
          })
        })
    },
    // 展示添加类名的输入框 / 跳转到添加商品的界面
    increase (event) {
      let { target } = event.target.dataset;
      if (target == 'classify') {
        this.setData({
          hidden: false
        })
      } else {
        // 如果没有分类的时候
        if (!this.properties.classify_arr.length) {
          wx.showToast({
            title: '请先添加一个分类',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.navigateTo({
          url: `/pages/standard/standard?classify_id=${this.properties.classify_arr[this.data.active]._id}`
        })
      }
    },
    // 计算购物车
    calc (event) {
      let { count, index } = event.target.dataset;
      let results = this.data.results;
      if (count == '-' && results[index].num > 0) {
        results[index].num--;
        this.data.num--;
        this.data.sum -= results[index].price;
      }
      if (count == '+') {
        results[index].num++;
        this.data.num++;
        this.data.sum += results[index].price;
      }
      this.setData({
        results
      })
      let myEventDetail = {
        num: this.data.num,
        sum: this.data.sum.toFixed(2)
      }
      this.triggerEvent('myevent', myEventDetail)
    },
    // 取消添加类名
    minus () {
      this.setData({
        hidden: true
      })
    },
    // 添加类名
    add () {
      let shop_id = wx.getStorageSync('_id');
      let { classify, classify_arr } = this.data;
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('so_classify')
        .add({
          data: {
            classify,
            shop_id,
            time: Date.now()
          }
        })
        .then(res => {
          classify_arr.push({
            _id: res._id,
            classify,
            shop_id
          })
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            hidden: true,
            classify: '',
            classify_arr
          })
        })
    },
    //删除分类或者商品
    remove (event) {
      let { index, target } = event.target.dataset;
      let { _id, title, classify } = this.properties[target][index];
      let message = {
        classify_arr: '分类',
        goods_arr: '商品'
      }
      wx.showModal({
        title: `删除${message[target]}`,
        content: `将删除${message[target]}"${title || classify}"`,
        confirmText: '删除',
        confirmColor: '#ff3333',
        success: (result) => {
          if (result.confirm) {
            const db = wx.cloud.database();
            const _ = db.command;
            let database = {
              classify_arr: 'so_classify',
              goods_arr: 'so_goods'
            }
            this.properties[target].splice(index, 1);
            this.setData({
              [target]: this.properties[target]
            })
            // 删除数据库操作
            db.collection(database[target])
              .doc(_id)
              .remove()
              .then(() => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                })
              })
            // 如果删除分类,则删除包含的商品
            if (target == 'classify_arr') {
              db.collection('so_goods')
                .where({
                  classify_id: _id
                })
                .remove()
            }
          }
        }
      });
    },
    // 更新商品信息
    update (event) {
      let { index } = event.currentTarget.dataset;
      let { _id } = this.data.goods_arr[index];
      wx.navigateTo({
        url: `/pages/standard/standard?_id=${_id}`
      })
    },
    // 向下 / 向上移动
    move (event) {
      let { index, type, direction } = event.target.dataset;
      let data = this.data;
      let database = {
        classify_arr: 'so_classify',
        goods_arr: 'so_goods'
      }
      let distance = direction == 'down' ? 1 : -1;
      let flag = direction == 'down' ? index < data[type].length - 1 : index >= 1;
      if (flag) {
        [data[type][index], data[type][index + distance]] = [data[type][index + distance], data[type][index]];
        this.setData({
          [type]: data[type]
        })
        const db = wx.cloud.database();
        const _ = db.command;
        db.collection(database[type])
          .doc(data[type][index]._id)
          .update({
            data: {
              time: data[type][index + distance].time
            }
          })
        db.collection(database[type])
          .doc(data[type][index + distance]._id)
          .update({
            data: {
              time: data[type][index].time
            }
          })
      }
    },
  }
})
