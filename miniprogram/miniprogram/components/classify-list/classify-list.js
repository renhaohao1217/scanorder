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
    },
    num: {
      type: Number,
      value: 0
    },
    sum: {
      type: Number,
      value: 0
    }
  },
  // 初始数据
  data: {
    hidden: true,
    classify: '',
    active: 0,
    timer: ''
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
      // 获取分类对应的商品和购物车信息
      wx.cloud.callFunction({
        name: 'lookup',
        data: {
          collection: 'so_goods',
          from: 'so_cart',
          localField: '_id',
          foreignField: 'goods_id',
          as: 'cartList',
          match: {
            classify_id: classify_arr[index]._id
          }
        },
        success: res => {
          this.setData({
            goods_arr: res.result.list,
            active: index
          })
        }
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
    // 展示商品信息
    info (event) {
      let { index } = event.currentTarget.dataset;
      let { _id } = this.data.goods_arr[index];
      let { num, sum, goods_arr, source } = this.data
      if (source == 'waiter') {
        wx.navigateTo({
          url: `/pages/standard/standard?_id=${_id}`
        })
        return;
      }
      wx.navigateTo({
        url: `/pages/goods-info/goods-info?_id=${_id}&num=${num}&sum=${sum}&goods_arr=${JSON.stringify(goods_arr)}&index=${index}`
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
              wx.cloud.callFunction({
                name: 'remove',
                data: {
                  collection: 'so_goods',
                  where: {
                    classify_id: _id
                  }
                }
              })
            }
          }
        }
      });
    },
    // 向下 / 向上移动
    move (event) {
      let { index, type, direction } = event.target.dataset;
      let data = this.data;
      let { timer } = this.data;
      let database = {
        classify_arr: 'so_classify',
        goods_arr: 'so_goods'
      }
      let distance = direction == 'down' ? 1 : -1;
      let flag = direction == 'down' ? index < data[type].length - 1 : index >= 1;
      if (flag) {
        // 获取当前选中的索引
        let active = data.active;
        // 如果当前选中的索引将要进行移动，向上索引-1，向下索引+1
        if (active == index) {
          active += distance;
        } else if (active == index - 1 && distance == -1) { // 如果当前索引在要移动的上方，索引+1
          active++;
        } else if (active == index + 1 && distance == 1) {
          active--;
        }
        // 交换两个数组的位置
        [data[type][index], data[type][index + distance]] = [data[type][index + distance], data[type][index]];
        this.setData({
          [type]: data[type],
          active
        })
        // 如果存在，则清除定时器，重新计时
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // 更新数据库
          const db = wx.cloud.database();
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
          clearTimeout(timer);
          this.setData({
            timer: ''
          })
        }, 300)
      }
    },
    // 计算购物车
    calc (event) {
      const db = wx.cloud.database();
      const _ = db.command;
      let { count, index } = event.target.dataset;
      let { goods_arr, num, sum, timer } = this.data;
      // 数量减
      if (count == '-' && !!goods_arr[index].cartList.length) {
        // 更新数据
        goods_arr[index].cartList[0].amount--;
        num--;
        sum -= goods_arr[index].price;
        sum = parseFloat(sum).toFixed(2);
        if (goods_arr[index].cartList[0].amount == 0) {
          goods_arr[index].cartList = [];
        }
        // 将数据返回至购物车
        this.triggerEvent('myevent', { num, sum, goods_arr });
        // 定时器防抖
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // 如果数量为0，则从数据库中删除
          if (goods_arr[index].cartList.length == 0) {
            db.collection('so_cart')
              .where({
                goods_id: _.eq(goods_arr[index]._id)
              })
              .remove()
          } else {
            // 更新数据库
            db.collection('so_cart')
              .where({
                goods_id: _.eq(goods_arr[index]._id)
              })
              .update({
                data: {
                  amount: goods_arr[index].cartList[0].amount
                }
              })
          }
          clearTimeout(timer);
          this.setData({
            timer: ''
          })
        }, 300)
        // 更新数据
        this.setData({
          goods_arr,
          num,
          sum
        })
      }
      // 数量加，如果之前存在
      if (count == '+' && !!goods_arr[index].cartList.length) {
        // 更新数据
        goods_arr[index].cartList[0].amount++;
        num++
        sum = parseFloat(sum) + parseFloat(goods_arr[index].price);
        // 将数据返回至购物车
        this.triggerEvent('myevent', { num, sum, goods_arr });
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // 更新数据库
          db.collection('so_cart')
            .where({
              goods_id: _.eq(goods_arr[index]._id)
            })
            .update({
              data: {
                amount: goods_arr[index].cartList[0].amount
              }
            })
          clearTimeout(timer);
          this.setData({
            timer: ''
          })
        }, 300)
        // 更新数据
        this.setData({
          goods_arr,
          num,
          sum
        })
      }
      // 数量加，之前不存在
      if (count == '+' && !goods_arr[index].cartList.length) {
        goods_arr[index].cartList.push({
          amount: 1
        })
        num++
        sum = parseFloat(sum) + parseFloat(goods_arr[index].price);
        // 将数据返回至购物车
        this.triggerEvent('myevent', { num, sum, goods_arr });
        this.setData({
          goods_arr,
          num,
          sum
        })
        db.collection('so_cart')
          .add({
            data: {
              amount: 1,
              goods_id: goods_arr[index]._id
            }
          })
      }
    }
  }
})
