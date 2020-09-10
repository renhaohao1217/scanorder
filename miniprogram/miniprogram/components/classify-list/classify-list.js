// components/classify-list/classify-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    source: 'user',
    results: [],
    active: 0,
    num: 0,
    sum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select (event) {
      let index = event.currentTarget.dataset.index;
      this.setData({
        results: this.properties.result[index].child,
        active: index
      })
    },
    calc (event) {
      let { count, index } = event.target.dataset;
      let results = this.data.results;
      if (count == '-' && results[index].num > 0) {
        results[index].num--;
        this.data.num--;
        this.data.sum -= results[index].price;
      }
      if (count == '+') {
        results[index].num++;
        this.data.num++;
        this.data.sum += results[index].price;
      }
      this.setData({
        results
      })
      let myEventDetail = {
        num: this.data.num,
        sum: this.data.sum.toFixed(2)
      }
      this.triggerEvent('myevent', myEventDetail)
    }
  },
  attached () {
    this.setData({
      results: this.properties.result[0].child
    })
  }
})
