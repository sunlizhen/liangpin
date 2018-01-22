var userInfo = {};
var rescode = null;
const config = require('../../config');

function getUserInfo(callback){
  wx.getUserInfo({
    success: function (res_useInfo) {
      userInfo = res_useInfo.userInfo;
      //获取成功，将iv和加密码信息传递后台;

        console.dir('yonghutongyi');

        wx.login({
          success: function (res) {
            if (res.code) {
              rescode = res.code;

                wx.request({
                    url: config.protocol+config.host+'/login',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    dataType: "json",
                    data: {
                        jsCode: rescode,
                        encryptedData: res_useInfo.encryptedData,
                        iv: res_useInfo.iv
                    },
                    method: "POST",
                    //将参数传递给后台成功，返回的数据
                    success: function (res_return) {
                        if (res_return.data.ecode == "0" && res_return.data.msg == "ok") {
                            //将数据存储在本地
                            wx.setStorage({
                                key: 'key',
                                data: res_return.data.content.token,
                            })
                            typeof callback == 'function' && callback();
                        } else {
                            wx.setStorage({
                                key: 'key',
                                data: 'key'
                            })
                            wx.showToast({
                                title: '请重新登录',
                            })
                        }
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



    },
    fail: function () {
      function openSetting(){
        wx.openSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo'] == false) {
              openSetting();
              return;
            }
            getUserInfo(callback);
          },
          fail: function () {
            console.log('返回失败')
          }
        })
      }
      openSetting();
      wx.setStorage({
        key: 'key',
        data: 'key'
      })
    }
  })
}

// 登录信息封装
function login(forceLogin, callback){
  //获取用户登录过期还是未过期
  wx.checkSession({
    //未过期
    success: function () {

      if (forceLogin ) {
        getUserInfo(callback);
      }
      
    },
    //登录过期，重新登录
    fail: function () {

      getUserInfo(callback);

      // wx.login({
      //   success: function (res) {
      //     if (res.code) {
      //       rescode = res.code;
      //       getUserInfo();
      //     } else {
      //       console.log('获取用户登录态失败！' + res.errMsg)
      //     }
      //   },
      //   fail: function (res_fail) {
      //     console.log("接口调用失败")
      //   }
      // })
    }
  })
}
  // huoqu:function(){
  //   //获取用户登录过期还是未过期
  //   var that = this;
  //   wx.checkSession({
  //     //未过期
  //     success: function () {
  //       console.log("登录未过期，还在登录")
  //     },
  //     //登录过期，重新登录
  //     fail: function () {
  //       wx.login({
  //         success: function (res) {            
  //           //登录成功获取用户的信息
  //           wx.getUserInfo({
  //             success: function (res_useInfo) {
  //               // console.log(res_useInfo)
  //               //获取token值;
  //               wx.getStorage({
  //                 key: 'key',
  //                 success: function (res_zifu) {
  //                   console.log(res_zifu.data)
  //                   var token_zifu = res_zifu.data;
  //                   that.setData({
  //                     token_zifu: token_zifu
  //                   })
  //                   console.log(this.token_zifu)
  //                   //获取成功，将token传递后台;
  //                   wx.request({
  //                     url: 'https://danianhuocs.lppz.com/test',
  //                     header: {
  //                       'content-type': 'application/x-www-form-urlencoded',
  //                       'Authorization': 'Bearer ' + token_zifu
  //                     },
  //                     dataType: "json",
  //                     method: "GET",
  //                     //将参数传递给后台成功，返回的数据
  //                     success: function (res_return) {
  //                       console.log(res_return);
  //                     }
  //                   })
  //                 }
  //               })                  
  //             }
  //           })
  //         },
  //         fail: function (res_fail) {
  //           console.log("登录失败显示的信息" + res_fail)
  //           //登录错误返回当前的页面;
  //           wx.navigateTo({
  //             url: '/pages/login/login',
  //           })
  //         }
  //       })
  //     }
  //   })
  // }
// 导出
module.exports = {
  login: login,
  userInfo: userInfo
}  