// 引入登录封装；
var login = require("../../common/login.js")

// 引入时间插件;
var timer = require("../../common/timer.js");

// 引入api封装接口请求;
var api = require("../../common/api.js")
//获取应用实例  
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgurl: api.Url(), // 图片地址,
    src: api.Url() + 'images/music.mp3',
    loop: true,
    audioCtx: null
  },
  onShow: function(){
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  onHide: function(){
    this.audioCtx.pause()
  },
  onLoad: function (options) {
    login.login() //用户登录引用；
    var that = this;
    // var pages = getCurrentPages();
    api.POST({
      url: "/purchase/status",
      params: {
      },
      // 传递成功后台返回的数据，用于支付
      success: function (res) {
        // 隐藏loaddig
        wx.hideLoading();
        var dataCon = res.content;
        if(dataCon == 0){
          wx.redirectTo({
            url: '/client/pages/end/end'
          })
        } 
      }
    })
  },
  // 点击查看有几个好友参团；
  renShow:function(){
    this.setData({
      renShow:true
    })
  },
  // 点击查看几个好友参团隐藏
  yinShow:function(){
    // 请求首页图片地址

  },
// 进入拼团页面
  pintuan:function(){
  //  wx.redirectTo({
  //    url: '/client/pages/openGroup/openGroup',
  //  })
   wx.navigateTo({
    url: '/client/pages/openGroup/openGroup',
   })
  }
})
