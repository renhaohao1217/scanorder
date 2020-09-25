Component({
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    cart_arr: {
      type: Array,
      value: []
    },
    num: {
      type: Number,
      value: 0.00
    },
    sum: {
      type: String,
      value: ''
    },
    order: {
      type: String,
      value: ''
    },
    _id: {
      type: String,
      value: ''
    }
  },
  data: {},
  methods: {
    // 切换购物车页面
    show () {
      let { hidden } = this.data;
      if (hidden) {
        this.getCart()
          .then(res => {
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
            this.triggerEvent('tabcart', { cart_arr: res.result.list, num, sum })
          });;
      }
      hidden = !hidden
      this.setData({
        hidden
      })
      this.triggerEvent('tabcart', { hidden })
    },
    // 获取购物车的信息
    getCart () {
      return new Promise((resolve, reject) => {
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
            resolve(res);
          }
        })
      })
    },
    // 支付
    pay () {
      this.getCart()
        .then(res => {
          let { cart_arr, order, _id } = this.data;
          cart_arr = res.result.list;
          if (!cart_arr.length) {
            wx.showToast({
              title: '请选择商品',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          // 创建订单
          let time = Date.now();
          const db = wx.cloud.database();
          db.collection('so_order')
            .add({
              data: {
                classify: order,
                state: '待支付',
                time,
                goods: cart_arr,
                shop_id: _id
              }
            })
            .then(res => {
              // 清空购物车
              wx.cloud.callFunction({
                name: 'getOpenid',
                success: res => {
                  wx.cloud.callFunction({
                    name: 'remove',
                    data: {
                      collection: 'so_cart',
                      where: {
                        _openid: res.result.openid
                      }
                    }
                  })
                  this.triggerEvent('tabcart', { cart_arr: [], num: 0, sum: 0 })
                }
              })
              // 构造参数，向订单详情页传递参数
              let indent = {
                _id: res._id,
                classify: order,
                time,
                goods: cart_arr,
                state: '待支付'
              }
              // 跳转到订单详情页
              wx.navigateTo({
                url: `/pages/indent-info/indent-info?indent=${JSON.stringify(indent)}`,
              });
            })
        });;
    },
  },
  // 组件初始化完毕，进入页面节点树
  attached: function () {
    this.getCart()
      .then(res => {
        let num = 0, sum = 0, cart_arr = res.result.list;
        for (let item of cart_arr) {
          num += item.amount;
          sum += item.amount * item.goodsList[0].price
        }
        this.setData({
          cart_arr,
          num,
          sum: parseFloat(sum).toFixed(2)
        })
        this.triggerEvent('tabcart', { cart_arr, num, sum })
      });
  }
});