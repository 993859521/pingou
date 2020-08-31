var app = getApp()
Page({
  data: {
    img_url: [],
    context: '',
    titleInput: '',
    img_url_ok:'',
    tlist:[],
    activeCategoryId: 0,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    });
    this.setData({
      tlist: app.tlist,
    })
  },
  input: function (e) {
    this.setData({
      context: e.detail.value
    })
  },
  typecheck: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
    });
    console.info(this.data.activeCategoryId)

  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res.tempFilePaths+"");
        if (res.tempFilePaths.length > 0) {

          //图如果满了4张，不显示加图
          if (res.tempFilePaths.length == 4) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }

          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }

          that.setData({
            img_url: img_url
          })
          wx.showLoading({
            title: '上传中',
          })
          for (let i = 0; i < img_url.length; i++) {
            console.log("images----" + img_url[i]);
            wx.uploadFile({
              //路径填你上传图片方法的地址
              url: app.buildUrl('api/picture/index'),
              filePath: img_url[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                that.setData({
                  img_url_ok: that.data.img_url_ok + app.buildUrl('') + res.data + "#"
                })
                var n = that.data.img_url_ok.split("#")
                if(n.length - 1 == that.data.img_url.length){
                  wx.hideLoading()
                  wx.showModal({
                    title: '上传成功',
                    showCancel: false,
                  })
                }
              },
            })
          }
        }

      }
    })
  },
  //发布按钮事件
  send: function () {
    var that = this;
    if (that.data.titleInput==''){
      app.alert({
        'content': '请输入标题~~'
      });
      return
    }
    else if (that.data.context == '') {
      app.alert({
        'content': '请输入内容~~'
      });
      return
    }
    else if (that.data.activeCategoryId == 0) {
      
      app.alert({
        'content': '请选择类型~~'
    });
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    that.img_upload()
  },
  //图片上传
  img_upload: function () {
    let that = this;
    wx.request({
      url: app.buildUrl('api/tiezi/add'),
      header: app.getRequestHeader(),
      method: 'POST',

      data: {
        title: that.data.titleInput,
        type: that.data.activeCategoryId,
        context: that.data.context,
        images: that.data.img_url_ok,
        id: app.msg.id,
      },
      success: function (res) {
        console.info(res.code)
        if (res.data.code == 200) {
          wx.hideLoading()
          wx.showModal({
            title: '提交成功',
            showCancel: false,

          })
        }
      }
    })
  },
  previewImg(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let imgs = that.data.img_url;
    console.log(e);
    wx.previewImage({
      current: imgs[index],
      urls: imgs,
    })
  },
  deleteImg(e) {
    let _index = e.currentTarget.dataset.index;
    let imgs = this.data.img_url;
    imgs.splice(_index, 1);
    this.setData({
      img_url:imgs
    })
  },
  titleInput: function (e) {

    this.setData({
      titleInput: e.detail.value
    })
  },

})