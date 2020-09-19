//Page Object
Page({
  data: {
    indent: {},
    sum: 0
  },
  //options(Object)
  onLoad: function (options) {
    let { indent } = options;
    let { sum } = this.data;
    indent = JSON.parse(indent);
    for (let item of indent.goods) {
      sum += item.amount * item.goodsList[0].price
    }
    this.setData({
      indent,
      sum: parseFloat(sum).toFixed(2)
    })
  }
});