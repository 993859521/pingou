//answer.js


var app = getApp()
Page({
  data: {
    userInfo: {},
    id:0,
    images:'',
    title:'',
    context:'',
    lcnum:0,
    name:'',
    goods:[],
    images_list:[],
    image: {},
    message:'',
    num2:'',
  },
  bindChange: function (e) {
    this.data.message = e.detail.value
  },
  add:function(e){

    var that = this;
    if (that.data.message==''){
      app.alert({
        'content': '请输入内容~~'
      });
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: app.buildUrl('api/louceng/add'),
      header: app.getRequestHeader(),
      method: 'POST',
      data: {
        tieziid: that.data.id,
        Context: that.data.message,
        owner:app.msg.id
      },

      success: function (res) {
        var resp = res.data;
        if (res.data.code != 200) {

          return;
        }
        wx.hideLoading()
        wx.showModal({
          title: '提交成功',
          showCancel: false,

        })
        var goods={
          feed_source_name:app.msg.nickname,
          tieziid: that.data.id,
          context: that.data.message,
          owner: app.msg.id,
          images: app.msg.avatar,
        }
        that.setData({
          goods: that.data.goods.concat(goods),
          num2:'',
        });
      }
    });
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    });

    var that = this
    //调用应用实例的方法获取全局数据
    
      //更新数据
      that.setData({
        id:e.id,
        images: e.images,
        title: e.title,
        context: e.context,
        lcnum:e.lcnum,
        name:e.name,
        images_list: app.images_list
    });
    console.info(this.data.images_list)
    this.Louceng()
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio;    //计算的高度值
    var image = this.data.image;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      image: image
    })
    console.info(image)
  },
  scroll: function (e) {
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  Louceng: function () {
    var that = this;
    wx.request({
      url: app.buildUrl('api/louceng/index'),
      header: app.getRequestHeader(),
      method: 'POST',
      data: {
        id: that.data.id
      },

      success: function (res) {
        var resp = res.data;
        if (res.data.code != 200) {

          return;
        }
        var goods = resp.data.list;
        that.setData({
          goods: that.data.goods.concat(goods),
        });
      }
    });
  },
})
