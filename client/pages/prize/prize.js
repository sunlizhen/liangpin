// pages/prize/prize.js
var api = require("../../common/api.js");
var login = require("../../common/login.js")
var purchaseInfo = require("../common/purchaseInfo.js");
const config = require('../../../config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formShow: false,  //抽中奖提交信息显示控制
    noPriceShow: false,//没抽中奖信息显示控制
    circleList: [],//圆点数组  
    awardList: [],//奖品数组
    colorCircleFirst: '#FFDF2F',//圆点颜色1  
    colorCircleSecond: '#FE4D32',//圆点颜色2  
    colorAwardDefault: 'pink',//奖品默认颜色
    colorAwardSelect: "#feeeee",//奖品选中颜色
    indexSelect: 0,//被选中奖品的index
    isRunning: false,//是否正在抽奖 
    id: '',
    image: [
      "未中奖",
      "雅诗兰黛",
      "未中奖",
      "雅诗兰黛",
      "未中奖",
      "雅诗兰黛",
      "未中奖",
      "雅诗兰黛",
    ],
    imgurl: api.Url(),
    lottery_id: 0,
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
  // 将生成的图片保存到相册；
  baocun: function () {
    var that = this;
    wx.showLoading({
      title: "系统正在生成图片..."
    })

    wx.getImageInfo({
      src: config.protocol+config.host+'/static/images/canvas-2.png',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: function (res) {
            wx.hideLoading();
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
    this.setData({
      id: options.id
    });


    // -------------中奖样式
    var _this = this;
    //圆点设置  
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })

    //圆点闪烁  
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)//设置圆点闪烁的效果  

    // 奖品item设置;
    var awardList = [];
    var topAward = 25;
    var leftAward = 25;
    for (var i = 0; i < 8; i++) {
      if (i == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (i < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (i < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (i < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (i < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var image = this.data.image[i];
      awardList.push({ leftAward: leftAward, topAward: topAward, image: image })
    }
    this.setData({
      awardList: awardList
    })
  },
  start: function () {
    //返回的接口请求的数据；
    var win_price_num = api.win_price(0, 1);
    console.log(win_price_num)
    //产生的随机索引；
    var randomIndex = api.random(0, 3);
    var noPrice = [1, 3, 5, 7];
    var winPrice = [0, 2, 4, 6];
    var lastNoPrice = noPrice[randomIndex];
    var lastWinPrice = winPrice[randomIndex];
    console.log(lastNoPrice + ":" + lastWinPrice);

    //如果正在抽奖，就不能点击
    if (this.data.isRunning) {
      return
    };

    var that = this;
    var indexSelect = 0;
    var i = 0;

    var timer;
    this.setData({
      isRunning: true
    })

    api.GET({
      params: {
        purchase_id: this.data.id
      },
      url: '/purchase/draw/luck',
      success: function (res) {
        that.setData({
          lottery_id: res.content.id
        });
        if (res.content.is_lottery == 1) {
          // 中奖
          console.log("中奖")
          timer = setInterval(function () {
            indexSelect++;
            i += 80;
            if (i > 1600 && indexSelect == lastNoPrice) {
              clearInterval(timer);
              that.setData({
                isRunning: false
              })
              that.setData({
                formShow: true
              })
            }
            indexSelect = indexSelect % 8;
            that.setData({
              indexSelect: indexSelect
            })
          }, (200 + i))

        } else if (res.content.is_lottery == 0) {
          console.log("未中奖");
          // 未中奖
          timer = setInterval(function () {
            indexSelect++;
            i += 80;
            if (lastWinPrice == 0 && indexSelect == 8) {
              indexSelect = 0
            }
            if (i > 1600 && indexSelect == lastWinPrice) {
              clearInterval(timer);
              that.setData({
                isRunning: false
              })
              that.setData({
                noPriceShow: true
              })
            }
            indexSelect = indexSelect % 8;
            that.setData({
              indexSelect: indexSelect
            })
          }, (200 + i))
        }

      },
      fail: function (res) {
        console.log("传递失败" + res)
      }
      //  token值也传递过去
    });

  },  
  goback: function(){
    wx.redirectTo({
      url: '/client/pages/index/index',
    })
  },
  // 提交用户表单信息
  formSubmit: function (e) {
    console.log(e.detail.value)
    //  ttoken = token
    //写入参数  
    var params = new Object();
    params.id = this.data.lottery_id;
    params.name = e.detail.value.input1;
    params.phone = e.detail.value.input2;
    params.email = e.detail.value.input3;
    params.address = e.detail.value.input4;
    params.purchase_id = this.data.id;

    var msg = null;
    if (params.name == '') {
      msg = '姓名不能为空';
    } else if (params.phone == '') {
      msg = '手机不能为空';
    } else if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(params.phone))) {
      msg = '手机格式不正确';
    } else if (params.email == '') {
      msg = '邮箱不能为空';
    } else if (!(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(params.email))) {
      msg = '邮箱格式不正确';
    } else if (params.address == '') {
      msg = '地址不能为空';
    }
    if (msg) {
      wx.showToast({
        title: msg,
        duration: 2000
      });
      return;
    }

    api.POST({
      params: params,
      url: '/purchase/draw/save',
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          duration: 2000,
          success: function(){
            var timeout = setTimeout(function(){
              wx.redirectTo({
                url: '/client/pages/index/index',
              })
            },2000);
          }
        });
      }
    });

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