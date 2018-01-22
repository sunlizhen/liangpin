// client/pages/spoils/spoils.js
var login = require("../../common/login.js");
var api = require("../../common/api.js");
var purchaseInfo = require("../common/purchaseInfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payReceive: null,
    fightReceive: null,
    voteType: 0,
    id: '',
    isTuanzhang: null,
    imgurl: api.Url(),
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
    var that = this;
    login.login();
      // 控制团长优惠券显示
      that.setData({
        id: options.id,
        isTuanzhang: options.isTuanzhang
      });
      api.GET({
        url: '/card/list',
        params: {
          id: this.data.id
        },
        success: function(res){
          var dataCon = res.content;
          that.setData({
            isTuanzhang: dataCon.isHand,
            voteType: dataCon.type,
            payReceive: dataCon.payReceive,
            fightReceive: dataCon.fightReceive
          });
        }
      })
  },

  // 领券
  getCardPay: function(){
    purchaseInfo.getCard(this.data.id, 0);
  },

  getCardFight: function(){
    purchaseInfo.getCard(this.data.id, 1);
  },

  // 前往抽奖
  gotoPrice:function(){
    wx.redirectTo({
      url: '/client/pages/prize/prize?id=' + this.data.id + '&isTuanzhang=' + this.data.isTuanzhang,
    })
  },
  // 好友组团当团长
  gotuTuan:function(){
      wx.redirectTo({
        url: '/client/pages/index/index',
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})