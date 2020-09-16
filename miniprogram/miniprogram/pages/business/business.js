Page({
  // 页面的初始数据
  data: {
    title: '桌位号点餐',
    icon: false,
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
    hidden: true,
    timer: ''
  },
  // 切换购物车页面
  show () {
    let { hidden } = this.data;
    if (hidden) {
      this.getCart();
    }
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
      }, 5000)
      // 更新数据
      this.setData({
        cart_arr,
        timer,
        num,
        sum: parseFloat(sum).toFixed(2),
        goods_arr
      })
    }
  },
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
  },
  // 支付
  pay () {

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
  // 自定义函数
  myevent (event) {
    let { num, sum, goods_arr } = event.detail;
    this.setData({
      num,
      sum: parseFloat(sum).toFixed(2),
      goods_arr
    })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let { method } = options;
    let _id = wx.getStorageSync('_id');
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
        icon: !!method
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
    // 获取购物车的信息
    this.getCart();
  }
})