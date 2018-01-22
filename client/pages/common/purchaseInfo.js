var API = require("../../common/api.js");

var PurchaseInfo = {
  user_id: 0,
  // 选择拼团类型 5 15 100
  getPurchaseInfo: function(id, callback){
    // 获取参团的信息
    var self = this;

    API.GET({
      url: "/purchase/info",
      params: {
        id: id
      },
      // 传递成功后台返回的数据，用于支付
      success: function (res) {
        // 隐藏loaddig
        
        var dataCon = res.content;
        var isTuanzhang = ((dataCon.user_id == dataCon.purchase_info.user_id) ? 1 : 0);
        // 存储user_id
        self.user_id = dataCon.user_id;
        // 处理是否是
        callback({
          timer: {
            groupNum: dataCon.purchase_info.surplus_fight_number
          },
          isTuanzhang: isTuanzhang,
          purchase_info: dataCon.purchase_info,
          user_list: dataCon.user_list,
          is_user_pay: dataCon.is_user_pay,
          user_id: dataCon.user_id
        });

        //  拼团成功跳转拼团成功页面;
        //- 10超时，0开团，10，开团成功，20，拼团成功
        if (dataCon.purchase_info.fight_status == 20) {
          if (dataCon.is_user_pay == true){
            wx.redirectTo({
              url: '/client/pages/groupSuccess/groupSuccess?VouId=' + dataCon.purchase_info.type + '&id=' + dataCon.purchase_info.id + '&isTuanzhang=' + isTuanzhang,
            })
          }
        } else if (dataCon.purchase_info.fight_status == -10) {
          wx.showToast({
            title: '拼团超时'
          })
        } else if (dataCon.purchase_info.fight_status == 10) {
          // wx.showToast({
          //   title: '开团成功'
          // })
        } else if (dataCon.purchase_info.fight_status == 0) {
          // wx.showToast({
          //   title: '已经开团'
          // })
          // wx.redirectTo({
          //   url: '/client/pages/groupSuccess/groupSuccess?id=' + dataCon.purchase_info.id + '&isTuanzhang=' + isTuanzhang,
          // })
        }
      }
    })
  },
  getCard: function (purchaseId, isTuanzhang) {
    API.GET({
      url: "/",
      params: {
        id: purchaseId,
        // 团员type=0 团长type=1
        type: isTuanzhang
      },
      success: function (res) {
        console.log(res.content)
        var data = res.content;
        wx.addCard({
          cardList: [
            {
              cardId: data.card_id,
              cardExt: '{"code":"","openid":"","timestamp": "' + data.timestamp + '", "nonce_str":"' + data.nonce_str + '","signature":"' + data.signature + '"}'
            }
          ],
          success: function(res){
            wx.redirectTo({
              url: "/client/pages/pageSuccess/paySuccess?id=" + purchaseId
            })
            
            API.POST({
              url: "/card/receiveReport",
              params: {
                id: purchaseId,
                receive_status: 1
              },
              success: function (res) {

              }
            });
          },
          fail: function(res){
            API.POST({
              url: "/card/receiveReport",
              params: {
                id: purchaseId,
                receive_status: 0,
                msg: res.errMsg
              },
              success: function (res) {
                
              }
            });
          }
        })
      }
    })
  }
};
module.exports = PurchaseInfo;