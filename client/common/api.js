const config = require('../../config');
const util = require('./util');
const login = require('./login');

// ----------------随机数，点击开始抽奖停止在哪个格子上的随机数------------------------------
function random(n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n)
}

// 网址变量;
function Url(){
  return config.protocol+config.cdn;
}
//-----------------请求服务器返回的0-1的数字,有接口的时候可以替换掉------------------------------
function win_price(n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n)
}

//-----------------请求api时封装的插件------------------------------
//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  // 将存储的key传递给后台
  wx.getStorage({
    key: 'key',
    success: function (res_code) {
      //注意：可以对params加密等处理  
      wx.showLoading({
        title: '加载中',
        icon: 'loading'
      });
      wx.request({
        data: requestHandler.params || {},
        url: ((requestHandler.host || config.protocol + config.host) + requestHandler.url),
        method: method,
        header: util.extend({
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + res_code.data
        }, requestHandler.header),
        dataType: requestHandler.dataType || 'json',
        responseType: requestHandler.responseType || 'text',
        success: function (res) {
          wx.hideLoading();
          //注意：可以对参数解密等处理
          var msg = null;
          if (res.statusCode == 200) {
            if (res.data.ecode == 0) {
              typeof requestHandler.success == 'function' && requestHandler.success(res.data);
              return;
            } else if (res.data.ecode == 'noChanceDraw'){
              typeof requestHandler.nochance == 'function' && requestHandler.nochance(res.data);
            } else {
              msg = res.data.msg || msg;
            }
          } else if (res.statusCode == 401) {
            msg = '登录中...';
            login.login(true);
          } else {
            msg = res.errMsg || msg;
          }

          typeof requestHandler.error == 'function' && requestHandler.error(res.data);

          if (msg) {
            if (res.data.ecode && res.data.ecode.indexOf('modal') > -1){
              wx.showModal({
                title: '错误提示',
                content: msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            } else {
              wx.showToast({
                title: msg,
                icon: '',
                duration: 2000
              });
            }
          }
        },
        fail: function () {
          wx.hideLoading();
          typeof requestHandler.fail == 'function' && requestHandler.fail()
        }
      });
    },
  })
}

// ---------------------获取当前页面的url------------------------------
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/*----------------------获取当前页带参数的url的参数------------------------------*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length-1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

// -----------------------------导出----------------------------
module.exports = {
  GET: GET,
  POST: POST,
  win_price:win_price,
  random:random,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  Url:Url
}  