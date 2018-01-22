// client/pages/test/index.js
const config = require('../../../config');
Page({

    /**
     * 登录
     */
    'login' : function () {

        login();

        // 登录信息封装
        function login(){
            //获取用户登录过期还是未过期
            wx.checkSession({
                //未过期
                success: function () {
                    // console.log("登录未过期，还在登录")
                  login();

                },
                //登录过期，重新登录
                fail: function () {
                    wx.login({
                        success: function (res) {
                            console.log(res.code);
                            if (res.code) {
                                //登录成功获取用户的信息
                                wx.getUserInfo({
                                    success: function (res_useInfo) {
                                        console.log(res_useInfo)
                                        //获取成功，将iv和加密码信息传递后台;
                                        wx.request({
                                            url: config.protocol+config.host+'/login',
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                            },
                                            dataType: "json",
                                            data: {
                                                jsCode: res.code,
                                                encryptedData: res_useInfo.encryptedData,
                                                iv: res_useInfo.iv
                                            },
                                            method: "POST",
                                            //将参数传递给后台成功，返回的数据
                                            success: function (res_return) {
                                                console.log(res_return);
                                                if (res_return.data.errcode == "0" && res_return.data.msg == "ok") {
                                                    //将数据存储在本地
                                                    wx.setStorage({
                                                        key: 'jwt-token',
                                                        data: res_return.data.content.token,
                                                    })
                                                } else {
                                                    wx.showToast({
                                                        title: '请重新登录',
                                                    })
                                                }

                                            }
                                        })
                                    }
                                })
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }

                        },
                        fail: function (res_fail) {
                            console.log("接口调用失败")
                        }
                    })
                }
            })
        }

      // 导出
        module.exports = {
            login: login
        }


    },

    /**
     * 微信支付
     */
    'WxPay' : function () {


        wx.getStorage({
            key: 'jwt-token',
            success: function(res) {
              wx.request({
                url: config.protocol+config.host+'/pay',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + res.data
                },
                dataType: "json",
                method: "GET",
                //将参数传递给后台成功，返回的数据
                success: function (res_return) {
                  
                  var data = res_return.data.content;

                  wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.sign,
                    'success': function (res) {


                    },
                    'fail': function (res) {


                        console.dir(res);

                        
                    }
                  })

                }
              })
            }
        })
    },

    /**
     * 获取卡券
     */
    'getCardSign': function () {
      var cardId = 'pcGnxjlExuttqHRT9aXtjXKgPBD4';
      wx.getStorage({
        key: 'jwt-token',
        success: function (res) {
          wx.request({
            url: config.protocol+config.host+'/getCardSign',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + res.data
            },
            dataType: "json",
            data: { 'cardId': cardId },
            method: "GET",
            //将参数传递给后台成功，返回的数据
            success: function (res_return) {

              var data = res_return.data.content;


              wx.addCard({
                cardList: [
                  {
                    cardId: cardId,
                    cardExt: '{"code":"","openid":"","timestamp": "' + data.timestamp + '", "nonce_str":"' + data.nonce_str + '","signature":"' + data.signature + '"}'
                  }
                ],
                success: function (res) {
                  console.log(res.cardList) // 卡券添加结果
                }
              })
            }
          })
        }
      });
    },

    /**
     * 获取二维码
     */
    'getQrcode' : function () {

        var id = 1392;
        wx.getStorage({
            key: 'jwt-token',
            success: function (res) {
                wx.request({
                  url: config.protocol+config.host+'/program/qrcodeImage',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + res.data
                    },
                    dataType: "json",
                    data: { 'id': id },
                    method: "GET",
                    //将参数传递给后台成功，返回的数据
                    success: function (res_return) {


                    }
                })
            }
        });
    },

    /**
     * 团长开团
     */
    'purchaseCreate' : function () {

      wx.getStorage({
        key: 'jwt-token',
        success: function (res) {
          wx.request({
            url: config.protocol+config.host+'/purchase/create',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + res.data
            },
            dataType: "json",
            data: { 'type': 15 },
            method: "GET",
            //将参数传递给后台成功，返回的数据
            success: function (res_return) {
              var data = res_return.data.content;
              wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': data.signType,
                'paySign': data.sign,
                'success': function (res) {


                },
                'fail': function (res) {


                  console.dir(res);


                }
              })

            }
          })
        }
      });

    },
    //获取头像
    'getAvatarImage': function () {

      wx.getStorage({
        key: 'jwt-token',
        success: function (res) {
          wx.request({
            url: config.protocol+config.host+'/program/avatarImage',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + res.data
            },
            dataType: "json",
            data: { 'type': 15 },
            method: "GET",
            //将参数传递给后台成功，返回的数据
            success: function (res_return) {
              

            }
          })
        }
      });

    },

    /**
     * 抽奖
     */
    'luckDraw' : function () {

    },

    /**
     * 保存抽奖信息
     */
    'saveLuckDraw' : function () {

    }

    // getCard1: function () {
    //
    // wx.addCard({
    //   cardList: [
    //     {
    //       cardId: "pcGnxjlExuttqHRT9aXtjXKgPBD4",
    //       cardExt: '{"code":"","openid":"","timestamp": "1514199599", "nonce_str":"455963b4-09d5-4761-8859-5dd81f9a4c8e","signature":"96f428e2d42e7c86c275132c72b1a647477b0095"}'
    //     }
    //   ],
    //   success: function (res) {
    //     console.log(res.cardList) // 卡券添加结果
    //   }
    // })
  // }
})