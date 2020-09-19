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
        url: `/pages/indent-message/indent-message?indent=${JSON.stringify(indent)}`
      })
    }
  }
});
