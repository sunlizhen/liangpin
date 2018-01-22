// client/pages/groupSuccess/groupSuccess.js
var login = require("../../common/login.js");
var api = require("../../common/api.js");
var purchaseInfo = require("../common/purchaseInfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",//团id
    imgurl: api.Url(),
    src: api.Url() + 'images/music.mp3',
    loop: true,
    VouId: '',
    fightReceive: 1
  },
  onShow: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  onHide: function () {
    this.audioCtx.pause()
  },
  lingquan:function(){
    var purchaseId = this.data.id;
    // console.log(res.data);
    purchaseInfo.getCard(purchaseId, 1);
  },
  // 查看战力品页面；
  lookSpoils:function(){
    var that = this;
    wx.navigateTo({
      url: "/client/pages/spoils/spoils?id=" + this.data.id + '&isTuanzhang=' + this.data.isTuanzhang
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    login.login();
    this.setData({
      id: options.id,
      isTuanzhang: options.isTuanzhang,
      VouId: options.VouId
    });

    api.GET({
      url: '/card/list',
      params: {
        id: this.data.id
      },
      success: function (res) {
        var dataCon = res.content;
        that.setData({
          isTuanzhang: dataCon.isHand,
          VouId: dataCon.type,
          fightReceive: dataCon.fightReceive
        });
      }
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