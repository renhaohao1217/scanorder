Component({
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    goods_arr: {
      type: Array,
      value: []
    },
    cart_arr: {
      type: Array,
      value: []
    },
    num: {
      type: Number,
      value: 0,
    },
    sum: {
      type: String,
      value: ''
    }
  },
  data: {
    timer: ''
  },
  methods: {
    // 清空购物车
    clear () {
      let { goods_arr, cart_arr } = this.data;
      const db = wx.cloud.database();
      const _ = db.command;
      // 清空购物车的数据
      for (let i = 0; i < cart_arr.length; i++) {
        wx.cloud.callFunction({
          name: 'getOpenid',
          success: res => {
            db.collection('so_cart')
              .where({
                _openid: _.eq(res.result.openid)
              })
              .remove()
          }
        })
      }
      for (let val of goods_arr) {
        val.cartList = [];
      }
      this.setData({
        cart_arr: [],
        num: 0,
        sum: 0,
        goods_arr
      })
      this.triggerEvent('tabcartinfo', { cart_arr: [], num, sum, goods_arr })
    },
    // 计算购物车
    calc (event) {
      const db = wx.cloud.database();
      let { count, index } = event.target.dataset;
      let { cart_arr, timer, num, sum, goods_arr } = this.data;
      // 数量减
      if (count == '-' && !!cart_arr.length) {
        // 修改购物车的数量，总价
        if (cart_arr[index].amount > 0) {
          cart_arr[index].amount--;
          num--;
          sum -= cart_arr[index].goodsList[0].price;
          for (let val of goods_arr) {
            if (val._id == cart_arr[index].goodsList[0]._id) {
              val.cartList[0].amount--;
            }
          }
        }
        // 如果存在定时器，则清除定时器
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // 如果数量为0，则从数据库中删除
          if (cart_arr[index].amount == 0) {
            db.collection('so_cart')
              .doc(cart_arr[index]._id)
              .remove()
            for (let val of goods_arr) {
              if (val._id == cart_arr[index].goodsList[0]._id) {
                val.cartList = [];
              }
            }
            cart_arr.splice(index, 1);
            this.getCart();
          } else {
            // 更新数据库
            db.collection('so_cart')
              .doc(cart_arr[index]._id)
              .update({
                data: {
                  amount: cart_arr[index].amount
                }
              })
          }
          // 完成之后设置timer为null
          clearTimeout(timer);
          this.setData({
            timer: '',
            goods_arr
          })
        }, 300)
        // 更新数据
        this.setData({
          cart_arr,
          timer,
          num,
          sum: parseFloat(sum).toFixed(2),
          goods_arr
        })
        this.triggerEvent('tabcartinfo', { cart_arr, num, sum, goods_arr })
      }
      // 数量加
      if (count == '+') {
        cart_arr[index].amount++;
        num++;
        sum = parseFloat(sum) + parseFloat(cart_arr[index].goodsList[0].price);
        for (let val of goods_arr) {
          if (val._id == cart_arr[index].goodsList[0]._id) {
            val.cartList[0].amount++;
          }
        }
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // 更新数据库
          db.collection('so_cart')
            .doc(cart_arr[index]._id)
            .update({
              data: {
                amount: cart_arr[index].amount
              }
            })
          clearTimeout(timer);
          this.setData({
            timer: ''
          })
        }, 300)
        // 更新数据
        this.setData({
          cart_arr,
          timer,
          num,
          sum: parseFloat(sum).toFixed(2),
          goods_arr
        })
        this.triggerEvent('tabcartinfo', { cart_arr, num, sum, goods_arr })
      }
    },
    // 获取购物车的信息
    getCart () {
      wx.cloud.callFunction({
        name: 'lookup_cart',
        data: {
          collection: 'so_cart',
          from: 'so_goods',
          localField: 'goods_id',
          foreignField: '_id',
          as: 'goodsList',
          match: {}
        },
        success: res => {
          let num = 0, sum = 0;
          for (let item of res.result.list) {
            num += item.amount;
            sum += item.amount * item.goodsList[0].price
          }
          this.setData({
            cart_arr: res.result.list,
            num,
            sum: parseFloat(sum).toFixed(2)
          })
        }
      })
    },
  }
});
