//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    img_l: '',
    regFlag:true
  },
  goToIndex: function() {
    wx.switchTab({
      url: '../main/index/index'
    });
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    });
    
    this.checkLogin();
  },
  onShow: function() {

  },
  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
  checkLogin: function() {
    var that = this;
    wx.login({
      success: function(res) {
        if (!res.code) {
          app.alert({
            'content': '登录失败，请再次点击~~'
          });
          return;
        }
        wx.request({
          url: app.buildUrl('api/member/check-reg'),
          header: app.getRequestHeader(),
          method: 'POST',
          data: {
            code: res.code
          },
          success: function(res) {
            var resp = res.data;
            var msg = resp.data.list;
            var tlist = resp.data.tlist;
            console.info(msg)
            if (res.data.code == 200) {
              app.setCache("token", res.data.data.token);
              app.msg=msg;
              app.tlist = tlist;
              that.goToIndex();
              return;
            }else{
              that.setData({
                regFlag:false
              })
            }

          }
        });
      }
    });
  },
  login: function(e) {
    var that = this;
    if (!e.detail.userInfo) {
      app.alert({
        'content': '登录失败，请再次点击~~'
      });
      return;
    }

    var data = e.detail.userInfo;
    wx.login({

      success: function(res) {
        if (!res.code) {
          app.alert({
            'content': '登录失败，请再次点击~~'
          });
          return;
        }
        data['code'] = res.code;
        wx.request({
          url: app.buildUrl('api/member/login'),
          header: app.getRequestHeader(),
          method: 'POST',
          data: data,
          success: function(res) {
            if (res.data.code != 200) {
              app.alert({
                'content': res.data.msg
              });
              return;
            }
            var resp = res.data;
            app.setCache("token", res.data.data.token);
            var msg = resp.data.list;
            app.msg = msg;
            that.goToIndex();
          }
        });
      }
    });
  },

});