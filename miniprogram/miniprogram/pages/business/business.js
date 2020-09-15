Page({
  // 页面的初始数据
  data: {
    title: '桌位号点餐',
    method: 'table',
    // 导航栏和状态栏高度
    height:
      wx.getStorageSync('windowHeight') -
      wx.getStorageSync('statusBarHeight') -
      wx.getStorageSync('navigationBarHeight') +
      'px',
    shop: '',
    image: '',
    region: '',
    address: '',
    classify_arr: [],
    goods_arr: [],
    cart_arr: [],
    num: 0,
    sum: 0.00,
    hidden: true
  },
  // 自定义函数
  myevent (event) {
    let { num, sum } = event.detail;
    this.setData({
      num,
      sum
    })
  },
  // 切换购物车页面
  show () {
    let { hidden } = this.data;
    this.setData({
      hidden: !hidden
    })
  },
  // 隐藏购物车页面
  cancel () {
    this.setData({
      hidden: true
    })
  },
  // 计算购物车
  calc (event) {
    const db = wx.cloud.database();
    const _ = db.command;
    let { count, index } = event.target.dataset;
    let { cart_arr } = this.data;
    // 数量减
    if (count == '-') {
      cart_arr[index].amount--;
      // 更新数据库
      db.collection('so_cart')
        .doc(cart_arr[index]._id)
        .update({
          data: {
            amount: cart_arr[index].amount
          }
        })
      // 如果数量为0，则从数据库中删除
      if (cart_arr[index].amount == 0) {
        db.collection('so_cart')
          .doc(cart_arr[index]._id)
          .remove()
          .then(() => {
            // 获取购物车的信息
            this.lookup();
          })
        cart_arr.splice(index, 1);
      }
      // 更新数据
      this.setData({
        cart_arr
      })
    }
    // 数量加
    if (count == '+') {
      cart_arr[index].amount++;
      // 更新数据库
      db.collection('so_cart')
        .doc(cart_arr[index]._id)
        .update({
          data: {
            amount: cart_arr[index].amount
          }
        })
        .then(() => {
          // 获取购物车的信息
          this.lookup();
        })
      // 更新数据
      this.setData({
        cart_arr
      })
    }
  },
  // 获取购物车的信息
  lookup () {
    wx.cloud.callFunction({
      name: 'lookup_cart',
      data: {
        collection: 'so_cart',
        from: 'so_goods',
        localField: 'goods_id',
        foreignField: '_id',
        as: 'goodsList'
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
  // 清空购物车
  clear () {
    const db = wx.cloud.database();
    const _ = db.command;
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        db.collection('so_cart')
          .where({
            _openid: _.eq(res.result.openid)
          })
          .remove()
          .then(res => {
            // console.log(res);
          })
      }
    })
    this.setData({
      cart_arr: [],
      num: 0,
      sum: 0
    })
  },
  // 支付
  pay () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取操作的类型，桌位号点餐 / 流水号点餐
    let { method } = options;
    let { title } = this.data;
    if (method == 'serial') {
      title = '流水号点餐'
    }
    this.setData({
      method,
      title
    })
    // 获取商品信息
    const db = wx.cloud.database();
    const _ = db.command;
    // 商家信息
    db.collection('so_shop')
      .doc(wx.getStorageSync('_id'))
      .field({
        _id: false,
        shop: true,
        image: true,
        region: true,
        address: true,
      })
      .get()
      .then(res => {
        let { shop, image, region, address } = res.data;
        region = region.join('');
        this.setData({
          shop, image, region, address
        })
      })
    // 分类信息
    db.collection('so_classify')
      .where({
        shop_id: _.eq(wx.getStorageSync("_id"))
      })
      .orderBy('time', 'asc')
      .get()
      .then(res => {
        this.setData({
          classify_arr: res.data
        })
        // 获取分类对应的商品 !!!调用云函数
        !!res.data.length && wx.cloud.callFunction({
          name: 'lookup',
          data: {
            collection: 'so_goods',
            from: 'so_cart',
            localField: '_id',
            foreignField: 'goods_id',
            as: 'cartList',
            match: {
              classify_id: res.data[0]._id
            }
          },
          success: res => {
            this.setData({
              goods_arr: res.result.list
            })
          }
        })
      })

    // 获取购物车的信息
    wx.cloud.callFunction({
      name: 'lookup_cart',
      data: {
        collection: 'so_cart',
        from: 'so_goods',
        localField: 'goods_id',
        foreignField: '_id',
        as: 'goodsList'
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
          sum
        })
      }
    })
  }
})