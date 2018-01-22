// client/pages/template_img/template_img.js
var login = require("../../common/login.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:""
  },
  img:function(){
    var that = this; 
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        var imgUrl = res.tempFilePath;
        that.setData({
          imgUrl: imgUrl
        })
      }
    })   
  },
  baocun:function(){
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        var imgUrl = res.tempFilePath; 
        wx.saveImageToPhotosAlbum({
          filePath: imgUrl,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })   
   
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login();
    const ctx = wx.createCanvasContext('myCanvas');
// 获取网络图片的临时文件路径
    wx.getImageInfo({
      src: '../../templet_image/phone.jpg',
      success: function (res) {
        console.log(res.path)
        var width = res.width;
        var height = res.height;
        ctx.drawImage('../../templet_image/phone.jpg', 0, 0, 300, 300);
        ctx.drawImage('../../templet_image/phone.jpg', 20, 20, 50, 50);
        ctx.setTextAlign('center')
        ctx.fillText(width, 20, 20)
        ctx.fillText(height, 100, 100)
        ctx.draw()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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