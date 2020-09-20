//Component Object
Component({
  properties: {
    indent: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    info () {
      let { indent } = this.data;
      wx.navigateTo({
        url: `/pages/indent-info/indent-info?indent=${JSON.stringify(indent)}`
      })
    }
  }
});
