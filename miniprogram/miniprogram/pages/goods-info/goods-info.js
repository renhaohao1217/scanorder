//Page Object
Page({
  data: {
    description: '',
    image: '',
    price: '',
    sale: '',
    title: '',
    num: 0,
    sum: 0,
    hidden: true,
    cart_arr: [],
    goods_arr: [],
    index: '',
    timer: '',
    images: []
  },
  // 隐藏购物车页面
  cancel () {
    this.setData({
      hidden: true
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
        sum: parseFloat(sum).toFixed(2)
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
        sum: parseFloat(sum).toFixed(2)
      })
      db.collection('so_cart')
        .add({
          data: {
            amount: 1,
            goods_id: goods_arr[index]._id
          }
        })
    }
  },
  //options(Object)
  onLoad: function (options) {
    let { _id, num, sum, index, goods_arr } = options;
    wx.cloud.database()
      .collection('so_goods')
      .doc(_id)
      .field({
        _id: false,
        description: true,
        image: true,
        price: true,
        sale: true,
        title: true,
        images: true
      })
      .get()
      .then(res => {
        let { description, image, price, sale, title, images } = res.data;
        this.setData({
          description, image, price, sale, title,
          num, index, images,
          goods_arr: JSON.parse(goods_arr),
          sum: parseFloat(sum).toFixed(2)
        })
      })
  }
});