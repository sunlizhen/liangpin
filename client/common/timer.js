const config = require('../../config');
function timer(){
  var that = this;
  // 获取团id的值;
  wx.getStorage({
    key: 'purchaseId',
    success: function (res) {
      console.log(res.data)
      that.setData({
        idUrl: res.data
      })
    },
  })
  
  // 将存储的key传递给后台
  wx.getStorage({
    key: 'key',
    success: function (res_code) {
      console.log(res_code.data);
      var code = res_code.data;
      var timer = setInterval(function(){
        wx.request({
          url: config.protocol+config.host+"/purchase/info",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + res_code.data
          },
          dataType: "json",
          method: "GET",
          data: {
            // type: res_id.currentTarget.dataset.id,
            id: '35'
          },//将token传递给后台
          // 传递成功后台返回的数据，用于支付
          success: function (res) {
            console.log(res.data.content)
            var dataCon = res.data.content;
            that.setData({
              h: dataCon.purchase_info.surplus_time.h,
              m: dataCon.purchase_info.surplus_time.i,
              s: dataCon.purchase_info.surplus_time.s
            })
          }
        })
      })
     
    }
  })
}

module.exports = {
  timer: timer
}  