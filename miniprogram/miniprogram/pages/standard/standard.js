//Page Object
Page({
  data: {
    _id: '',
    image: '',
    title: '',
    price: '',
    cook: '',
    description: '',
    classify_id: '',
    sale: false,
    images: []
  },
  // 更新图片的方法
  choose () {
    let { images } = this.data;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `${Date.now()}-${parseInt(Math.random() * 65535)}.png`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            if (images.length > 0) {
              images.splice(0, 1, res.fileID)
            } else {
              images = [res.fileID]
            }
            this.setData({
              image: res.fileID,
              images
            })
          },
        })
      },
    })
  },
  // 更新其他数据
  update (event) {
    let { key } = event.target.dataset;
    let value = event.detail.value;
    this.setData({
      [key]: value
    })
  },
  // 添加图片
  add () {
    let { images } = this.data;
    if (images && images.length == 5) {
      wx.showToast({
        title: '最多能上传5张图片',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `${Date.now()}-${parseInt(Math.random() * 65535)}.png`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            images.push(res.fileID);
            this.setData({
              images
            })
          },
        })
      },
    })
  },
  // 删除图片
  remove (event) {
    let { index } = event.target.dataset;
    let { images } = this.data;
    if (index == 0) {
      wx.showToast({
        title: '商品展示图片不能删除',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showModal({
      title: '删除',
      content: '确认删除这张图片吗?',
      success (res) {
        if (res.confirm) {
          images.splice(index, 1);
          this.setData({
            images
          });
        }
      }
    })
  },
  // 保存修改
  save () {
    const db = wx.cloud.database();
    const _ = db.command;
    let { _id, image, title, price, cook, description, sale, classify_id, images } = this.data;
    // 将价格保留两位小数
    price = parseFloat(price).toFixed(2);
    // 如果没有_id,则为添加新的商品
    if (!_id) {
      db.collection('so_goods')
        .add({
          data: {
            image, title, price, cook, description, sale, classify_id, images,
            shop_id: wx.getStorageSync('_id'),
            time: Date.now()
          }
        })
        .then(() => {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          })
          // 返回上一级
          wx.navigateBack({
            delta: 1
          });
        })
    } else { // 如果存在_id，则为更新商品
      db.collection('so_goods')
        .doc(_id)
        .update({
          data: {
            image, title, price, cook, description, sale, images
          }
        })
        .then(() => {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
          // 返回上一级
          wx.navigateBack({
            delta: 1
          });
        })
    }
  },
  // 获取路由跳转传进来的参数
  onLoad (options) {
    let { classify_id, _id } = options;
    this.setData({
      classify_id,
      _id
    })
    if (_id) {
      wx.cloud.database()
        .collection('so_goods')
        .doc(_id)
        .get()
        .then(res => {
          let { image, title, price, cook, description, sale, images } = res.data;
          this.setData({
            image, title, price, cook, description, sale, images
          })
        })
    }
  },
  blur (e) {
    console.log(e);
  }
});