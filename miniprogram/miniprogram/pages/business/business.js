Page({
  // 页面的初始数据
  data: {
    _id: '',
    title: '桌位号点餐',
    icon: false,
    method: 'table',
    // 导航栏和状态栏高度
    height:
      wx.getStorageSync('windowHeight') -
      wx.getStorageSync('statusBarHeight') -
      wx.getStorageSync('navigationBarHeight') + 'px',
    shop: '',
    image: '',
    region: '',
    address: '',
    classify_arr: [],
    goods_arr: [],
    cart_arr: [],
    num: 0,
    sum: 0.00,
    hidden: true,
    timer: '',
    order: ''
  },
  // 隐藏购物车页面
  cancel () {
    this.setData({
      hidden: true
    })
  },
  // 自定义函数
  myevent (event) {
    let { num, sum, goods_arr } = event.detail;
    this.setData({
      num,
      sum: parseFloat(sum).toFixed(2),
      goods_arr
    })
  },
  // 购物车自定义函数
  tabcart (event) {
    let { cart_arr, hidden, num, sum } = event.detail;
    if (hidden !== undefined) {
      this.setData({
        hidden
      })
    } else {
      this.setData({
        cart_arr, num, sum: parseFloat(sum).toFixed(2)
      })
    }
  },
  // 购物车详细信息自定义函数
  tabcartinfo (event) {
    let { cart_arr, num, sum, goods_arr } = event.detail;
    this.setData({
      cart_arr, goods_arr, num, sum: parseFloat(sum).toFixed(2)
    })
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
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let { method, order } = options;
    // 获取商家shop_id
    let _id = wx.getStorageSync('_id');
    this.setData({
      _id
    })
    // 获取操作的类型，桌位号点餐 / 流水号点餐 
    if (method) {
      if (method == 'serial') {
        let title = '流水号点餐';
        this.setData({
          method,
          title
        })
      }
      this.setData({
        icon: !!method,
        order
      })
    }
    // 获取商品信息
    const db = wx.cloud.database();
    const _ = db.command;
    // 商家信息
    db.collection('so_shop')
      .doc(_id)
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
    // 获取分类信息 和 商品信息
    db.collection('so_classify')
      .where({
        shop_id: _.eq(_id)
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
  },
  onShow: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    let _id = wx.getStorageSync('_id');
    // 获取分类信息 和 商品信息
    db.collection('so_classify')
      .where({
        shop_id: _.eq(_id)
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
    this.getCart();
  }
})