// 引入登录封装；
var login = require("../../common/login.js")
// 引入api封装接口请求;
var api = require("../../common/api.js")
//获取应用实例  
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iv: '', //加密算法的初始向量
    encryptedData: '', //完整用户信息的加密数据
    jsCode: "",//用户登录凭证
    token_zifu: "", //服务器返回的token
    imgurl: api.Url(), // 图片地址
    Tid: '',//团id
    nochange: false,
    src: api.Url() + 'images/music.mp3',
    loop: true
  },
  onShow: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  onHide: function () {
    this.audioCtx.pause()
  },

  onLoad: function (options) {
    login.login() //用户登录引用；
  },
  // ----------------------------------团长开团事件（团长）
  fiveGroup: function (res_id) {
    console.log(res_id)
    wx.setStorage({
      key: 'VouId',
      data: res_id.currentTarget.dataset.id,
    })
    var that = this;
    // wx.showToast({
    //   title: '已选' + res_id.currentTarget.dataset.id + '人团',
    // });
    api.POST({
      url: "/purchase/create",
      params: {
        type: res_id.currentTarget.dataset.id
      },//将token传递给后台
      // 传递成功后台返回的数据，用于支付
      nochance: function (res) {
        that.setData({
          nochange : true
        })
      },
      success: function (res) {
        var dataCon = res.content;
        wx.requestPayment({
          'timeStamp': dataCon.timeStamp,
          'nonceStr': dataCon.nonceStr,
          'package': dataCon.package,
          'signType': 'MD5',
          'paySign': dataCon.sign,
          'success': function (res_b) {
            if (res.ecode == "0") {
              // api.GET({
              //   url: '/trade/' + res_b.orderId,
              //   success: function(res){
                  
              //   }
              // });
              wx.showToast({
                title: '开团成功'
              })
              wx.redirectTo({
                url: '/client/pages/nextPaySuccess/nextPaySuccess?id=' + res.content.purchaseId + '&isTuanzhang=1',
              })
            } else {
              // wx.showToast({
              //   title: '支付失败',
              // })
            }

          },          
          'fail': function () {
            // wx.showToast({
            //   title: '调用接口失败',
            // })
            // wx.redirectTo({
            //   url: '/client/pages/nextPaySuccess/nextPaySuccess?id=' + res.content.purchaseId + '&isTuanzhang=1',
            // })
          }
        })
      }
    })

  },
  closeChance: function () {
    this.setData({
      nochange: false
    })
  },
  // 点击查看有几个好友参团；
  renShow: function () {
    this.setData({
      renShow: true
    })
  },
  // 点击查看几个好友参团隐藏
  yinShow: function () {
    this.setData({
      renShow: false
    })
  },
  // 进入拼团页面
  pintuan: function () {
    this.setData({
      indexShow: false,
      groupShow: true
    })
  },
  // 进入规则页面；
  gotoRule: function () {
    wx.navigateTo({
      url: "/client/pages/list/list"
    })
  },
  // 返回详情页面
  return: function () {
    this.setData({
      groupShow: true
    })
  }

})
