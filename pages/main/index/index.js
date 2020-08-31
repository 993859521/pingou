//index.js

var app = getApp()
Page({
  data: {
    p: 1,
    goods: [],
    loadingMoreHidden: true,
    tlist:[{
      id: '0',
      name: '全部'
    },
    ],
    activeCategoryId: 0,
    one:0,
    searchInput:'',
    swiperCurrent: 0,
    banners:[
     { 
       id:1,
        pic_url: "https://www.able.ac.cn/static/images/upload/2019052414571231.jpg"
      },
      {
        id: 2,
        pic_url: "https://www.able.ac.cn/static/images/upload/2019052414571236.jpg"
      },
      {
        id: 3,
        pic_url: "https://www.able.ac.cn/static/images/upload/2019052414571270.jpg"
      }
    ]
  },
  bindItemTap: function (e) {
    wx.navigateTo({
      url: '../../answer/answer?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&images=" + e.currentTarget.dataset.images + "&title=" + e.currentTarget.dataset.title + "&context=" + e.currentTarget.dataset.context + "&lcnum=" + e.currentTarget.dataset.lcnum 
    })
    app.images_list = e.currentTarget.dataset.list
  },
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //事件处理函数
  SearchTiezi: function (type,e) {
    var that = this;
    if (!that.data.loadingMoreHidden) {
      return;
    }
    console.info('type' + type)
    wx.request({
      url: app.buildUrl('api/tiezi/search'),
      header: app.getRequestHeader(),
      method: 'POST',
      data: {
        type: that.data.activeCategoryId,
        p: that.data.p,
        mix_kw: that.data.searchInput
      },
     
      success: function (res) {
        var resp = res.data;
        if (res.data.code != 200) {
         
          return;
        }
        var goods = resp.data.list;


        that.setData({
          goods: that.data.goods.concat(goods),
          p: that.data.p + 1,
        });
        if (resp.data.has_more == 0) {
          that.setData({
            loadingMoreHidden: false
          });
        }
      }
    });
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    });
    console.log('onLoad')
    this.setData({
      tlist: this.data.tlist.concat(app.tlist)
    })
    this.SearchTiezi()
    //调用应用实例的方法获取全局数据
  },

  SearchInput:function(e){
    this.setData({
      searchInput: e.detail.value
    })
    this.setData({
      p: 1,
      goods: [],
      loadingMoreHidden: true,
      searchInput: this.data.searchInput
    });
    this.SearchTiezi();
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading();}, 1000);
    this.SearchTiezi()
    console.log("lower")
   
  },
  upper: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); }, 1000);
    this.SearchTiezi()


  },
  typecheck: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
      p: 1,
      loadingMoreHidden: true,
      goods: [],
      one: 1,
      searchInput:''
    });
    this.SearchTiezi()
  },
});
