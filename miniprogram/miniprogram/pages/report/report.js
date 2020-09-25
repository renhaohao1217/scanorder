//Page Object
Page({
  data: {
    today: '',
    start: '',
    end: '',
    money: 0,
    amount: 0,
    sales: []
  },
  // 改变日期
  bindDateChange (e) {
    let { type } = e.currentTarget.dataset;
    let { value } = e.detail;
    let { start, end } = this.data;
    this.setData({
      [type]: value
    })
    // 获取报表
    if (type == 'start') {
      this.getReport(value, end);
    } else {
      this.getReport(start, value);
    }
  },
  // 获取报表
  getReport (start, end) {
    let { money, sales } = this.data;
    // 设置初始值
    money = 0;
    sales = [];
    start = new Date(`${start} 00:00:00`).getTime();
    end = new Date(`${end} 23:59:59`).getTime();
    // 从数据库中获取数据
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('so_order')
      .where({
        shop_id: _.eq(wx.getStorageSync('_id')),
        time: _.and(_.gt(start), _.lt(end)),
        state: _.eq('已支付')
      })
      .get()
      .then(res => {
        let result = res.data;
        let hash = {}
        for (let item1 of result) {
          for (let item2 of item1.goods) {
            // 计算每个商品的数量
            if (hash[item2.goodsList[0].title] == undefined) {
              hash[item2.goodsList[0].title] = item2.amount;
            } else {
              hash[item2.goodsList[0].title] += item2.amount;
            }
            // 计算总价格
            money += item2.amount * item2.goodsList[0].price;
          }
        }
        let num = Object.values(hash);
        num = [...new Set(num)].sort((a, b) => b - a);
        for (let val of num) {
          for (let key in hash) {
            if (hash[key] == val) {
              if (sales.length <= 5) {
                sales.push({
                  title: key,
                  amount: val
                })
              }
            }
          }
        }
        this.setData({
          money: parseFloat(money).toFixed(2),
          amount: result.length,
          sales,
        })
        this.draw(sales);
      })
  },
  // 使用canvas将销售表以柱状图的形式绘制出来
  draw (sales) {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        // 清楚之前的画布
        ctx.clearRect(0, 0, 300, 150);
        // 如果为空数组，则返回
        if (sales.length == 0) {
          return;
        }
        // 绘制水平线
        ctx.beginPath();
        ctx.moveTo(0, 150)
        ctx.lineTo(300, 150)
        ctx.stroke()
        ctx.closePath();
        // 设置柱状图比例
        let distance = 120 / sales[0].amount;
        // 设置文字样式
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
        for (let i in sales) {
          // 绘制柱状图
          ctx.fillRect(i * 65, 150 - sales[i].amount * distance, 40, 150);
          // 绘制文字
          ctx.fillText(sales[i].amount, i * 65 + 20, 145 - sales[i].amount * distance, 40)
        }
      })
  },
  //options(Object)
  onLoad (options) {
    // 设置今天时间
    let date = new Date();
    let year = date.getFullYear(),
      month = (date.getMonth() + 1 + '').padStart(2, '0'),
      day = (date.getDate() + '').padStart(2, '0');
    date = `${year}-${month}-${day}`;
    this.setData({
      start: date,
      end: date,
      today: date
    })
    // 获取报表信息
    this.getReport(date, date);
  }
});