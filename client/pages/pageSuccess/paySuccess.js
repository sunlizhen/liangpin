// 引入登录封装；
var login = require("../../common/login.js")
// 引入时间插件;
var api = require("../../common/api.js");

var purchaseInfo = require("../common/purchaseInfo.js");

const config = require('../../../config');

//获取应用实例  
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isTuanzhang: null,

    // 如果团员没支付需要显示的按钮
    payShow: false,

    fiveShow:false,//团长5元代金券显示控制
    fifShow:false,//团长15元代金券显示
    hundShow:false,//团上100元代金券显示
    
    groupNum: '01',//还差多少人成团
    tuanShow: true,
    renShow: false,//点击看有几个好友参团
    imgUrl: api.Url(), // canvas调用的图片
    h: "",//倒计时时间
    m: "",
    s: "",
    img: api.Url(),//网络图片搜索
    id: '',
    // 选择的类型  5 15 100
    VouId: '',
    // 参团人员
    user_list: [],
    
    // 是否已经过期
    showTimeout: false,

    fight_end_time: '',
    interval: null,
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
  onLoad: function (res_id) {
    console.log(res_id);
    var that = this;
    login.login(0, function(){
      that.getPurChaseInfo();
    });
    that.setData({
      id: res_id.id || encodeURIComponent(res_id.scene)
    })
    // 获取拼团信息
    this.getPurChaseInfo();

  },

  // ----------------------点击将canvas的图片导出（生成图片，点击分享）；
  canvasTu: function () {
    var that = this;

    wx.showLoading({
      title: '正在生成图片',
    });
    
    if (purchaseInfo.user_id == 0){
      wx.showToast({
        title: '获取失败，请重试',
      });
      that.getPurChaseInfo();
      return;
    }

    // 获取网络图片的临时图片路径；-------为canvas加载背景图片；
    const ctx = wx.createCanvasContext('myCanvas');
    wx.getUserInfo({
      success: function (res_useInfo) {
        console.log(res_useInfo)
        //获取成功，将iv和加密码信息传递后台;
        var userInfo = res_useInfo.userInfo;
        wx.getImageInfo({
          src: that.data.img + 'images/crs7.png',
          success: function (res) {
            var width = res.width;
            var height = res.height;
            ctx.drawImage(res.path, 0, 0, 1200, 1930);

            wx.getImageInfo({
              src: config.protocol+config.host+'/program/qrcodeImage3?id=' + that.data.id,
              success: function (res1) {

                // 画二维码
                ctx.drawImage(res1.path, 796, 1382, 260, 260);

                wx.getImageInfo({
                  src: config.protocol+config.host+'/program/avatarImage?id=' + purchaseInfo.user_id,
                  success: function (res2) {
                    // 画头像
                    if (typeof ctx.clip == 'function'){
                      ctx.save()
                      ctx.beginPath()
                      ctx.arc(180, 240, 80, 0, 2 * Math.PI)
                      ctx.clip()
                      ctx.drawImage(res2.path, 100, 160, 160, 160);
                      ctx.restore()
                    } else {
                      ctx.drawImage(res2.path, 100, 160, 160, 160);
                    }
                    ctx.draw();
                    // 生成canvas
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width: 1200,
                      height: 1930,
                      destWidth: 1200,
                      destHeight: 1930,
                      canvasId: 'myCanvas',
                      success: function (res) {
                        console.log(res.tempFilePath)
                        var imgUrl = res.tempFilePath;
                        that.setData({
                          imgUrl: imgUrl
                        })

                        wx.hideLoading()

                        wx.saveImageToPhotosAlbum({
                          filePath: imgUrl,
                          success: function (res) {
                            wx.showToast({
                              title: '保存成功',
                            })
                          },
                          fail: function (res) {
                            console.log(res)
                            wx.showToast({
                              title: res.Msg,
                            })
                          }
                        })
                      }
                    })

                  }
                })
              }
            })
          }
        })
      }
    })
  },

  // 倒计时
  countDown: function () {

    var self = this;
    var totalSecond = (new Date((self.data.fight_end_time).replace('-', '/').replace('-', '/').replace('-', '/'))).getTime() / 1000 - (new Date()).getTime() / 1000;

    totalSecond = parseInt(totalSecond);
    
    if(this.data.interval){
      clearInterval(this.data.interval);
    }

    this.data.interval = setInterval(function () {
      //console.log(totalSecond);
      
      // 秒数  
      var second = totalSecond;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      hrStr = parseInt(hrStr) + day * 24;
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        h: hrStr,
        m: minStr,
        s: secStr,
      });
      
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.showTimeout = true;
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          h: '00',
          m: '00',
          s: '00',
        });
      }
    }.bind(this), 1000);  

  },

  getPurChaseInfo: function(){
    var that = this;
    // 获取拼团信息
    purchaseInfo.getPurchaseInfo(this.data.id, function (data) {
      if (data.purchase_info.fight_status == 20 && data.is_user_pay == false){
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '拼团已满，去开团',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/client/pages/index/index',
              })
            }
          }
        })
        return false;
      }

      if (data.purchase_info.fight_status == 20 && data.is_user_pay == true){
        return;
      }

      // 倒计时
      that.setData({
        groupNum: data.timer.groupNum,
        isTuanzhang: data.isTuanzhang,
        VouId: data.purchase_info.type,
        payShow: !data.is_user_pay,
        user_list: data.user_list,
        fight_end_time: data.purchase_info.fight_end_time
      });
      if (data.purchase_info.fight_status == -10) {
        that.setData({
          showTimeout: true
        })
      } else {
        that.setData({
          showTimeout: false
        })
      }
      that.countDown();

    });
  },

  // 点击查看有几个好友参团；
  renShow: function () {
    this.getPurChaseInfo();
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

  // 好友支付参团
  friendPay: function () {
    var that = this;
    // wx.showToast({
    //   title: '455',
    // })
    // 将存储的key传递给后台
    api.GET({
      url: "/purchase/fight",
      params: {
        id:that.data.id
      },
      nochance: function () {
        that.setData({
          nochange: true
        })
      },
      // 传递成功后台返回的数据，用于支付
      success: function (res) {
        // console.log(res.content)
        var dataCon = res.content;
        wx.requestPayment({
          'timeStamp': dataCon.timeStamp,
          'nonceStr': dataCon.nonceStr,
          'package': dataCon.package,
          'signType': 'MD5',
          'paySign': dataCon.sign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功testssss',
            });
            that.setData({
              payShow: false
            })
            // 跳转到支付成功页面
            wx.redirectTo({
              url: '/client/pages/nextPaySuccess/nextPaySuccess?id=' + that.data.id + '&isTuanzhang=' + that.data.isTuanzhang,
            })
            //that.getPurChaseInfo();
          },
          'fail': function (res) {
            // 跳转到支付成功页面测试用
            wx.redirectTo({
              url: '/client/pages/nextPaySuccess/nextPaySuccess?id=' + this.data.id + '&isTuanzhang=' + this.data.isTuanzhang,
            })
            wx.showToast({
              title: res.errMsg,
            })
            that.setData({
              payShow: false
            })
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
  //好友--我要开团页面
  gototuan: function () {
    console.log(this.data.id)
    wx.redirectTo({
      url: '/client/pages/openGroup/openGroup?id=' + this.data.id,
    })
  },

  // 好友--跳转到规则页面;
  gotolist: function () {
    wx.navigateTo({
      url: '/client/pages/list/list',
    })
  },

  // 跳转首页
  goHome: function(){
    wx.redirectTo({
      url: '/client/pages/index/index'
    })
  },

  // 设置分享功能;
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '快加入我的战队，一起拼好礼！',
      path: '/client/pages/pageSuccess/paySuccess?id='+that.data.id,
      imageUrl:   config.protocol+config.host+"/static/images/paySuccess.jpg",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  }
})
