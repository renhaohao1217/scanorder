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
          let { cart_arr, sum, order, _id } = this.data;
          cart_arr = res.result.list;
          if (!cart_arr.length) {
            wx.showToast({
              title: '请选择商品',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.navigateTo({
            url: `/pages/indent-info/indent-info?cart_arr=${JSON.stringify(cart_arr)}&sum=${sum}&order=${order}&_id=${_id}`,
          });
        });;
    },
  },
  attached: function () {
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
      });
  }
});