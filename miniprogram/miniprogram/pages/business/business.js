Page({
  // 页面的初始数据
  data: {
    shop_id: '',
    title: '桌位号点餐',
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
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let { method, order, shop_id } = options;
    let { title } = this.data;
    // 获取操作的类型，桌位号点餐 / 流水号点餐 
    if (method == 'serial') {
      title = '流水号点餐';
    }
    this.setData({
      method, shop_id, title
    })
    // 操作数据库
    const db = wx.cloud.database();
    const _ = db.command;
    // 用户
    if (!order) {
      // 获取桌位号
      db.collection('so_serial')
        .where({
          shop_id: _.eq(shop_id),
          type: _.eq('table')
        })
        .orderBy('value', 'asc')
        .get()
        .then(res => {
          // 选择桌位号
          let tables = [];
          for (let val of res.data) {
            tables.push(val.value)
          }
          wx.showActionSheet({
            itemList: tables,
            success: res => {
              order = tables[res.tapIndex];
              this.setData({
                order
              })
            }
          })
        })
    } else {
      this.setData({
        order
      })
    }
    // 商家信息
    db.collection('so_shop')
      .doc(shop_id)
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
  },
  onShow: function () {
    let { shop_id } = this.data;
    const db = wx.cloud.database();
    const _ = db.command;
    // 获取分类信息 和 商品信息
    db.collection('so_classify')
      .where({
        shop_id: _.eq(shop_id)
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
  }
})