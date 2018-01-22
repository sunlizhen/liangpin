 // client/pages/nextPaySuccess/nextPaySuccess.js
var api = require("../../common/api.js");
var login = require("../../common/login.js");
var purchaseInfo = require("../common/purchaseInfo.js");
const config = require('../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frientShow: false, //好友支付成功页面
    headShow: true,//团长支付成功页面
    imgurl: api.Url(),
    id:'',
    isTuanzhang: null,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    login.login();
    this.setData({
      id: options.id,
      isTuanzhang: options.isTuanzhang
    })
  },
  // 好友支付成功页面--我要开团；
  returnIndex: function () {
    wx.redirectTo({
      url: '/client/pages/openGroup/openGroup',
    })
  },
  // ------------------------------点击领取10元优惠券（团长）
  Receive: function () {
    var purchaseId = this.data.id;
    // 获取优惠券
    purchaseInfo.getCard(purchaseId, 0);
    // 获取优惠券
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
// 获取团url；

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(this.data.id)
    var that = this;
    return {
      title: '快加入我的战队，一起拼好礼！',
      path: '/client/pages/pageSuccess/paySuccess?id=' + that.data.id,
      imageUrl:config.protocol+config.host+"/static/images/paySuccess.jpg",
      success: function (res) {
        wx.redirectTo({
          url: "/client/pages/pageSuccess/paySuccess?id=" + that.data.id,
        })

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  }
})
