const config = require('../config/config.http').default;
export default {
    /**
     * http请求
     */
    http({url = '', data = {}, method = 'GET', responseType = 'text', dataType = 'json'} = {}) {
        return new Promise((resolve, reject) => {
            url = `${config.BASE_API_URL}${url}`;
			let header = {
                    'content-type': 'application/x-www-form-urlencoded',
                };

			
            // 添加token
			if (url.indexOf("login") > -1) {
			    uni.setStorageSync('token', "");
			}
			if (url.indexOf("login") < 0 && uni.getStorageSync("token")) {
			    let token = uni.getStorageSync("token") + "";
			    header["Authorization"] = token;
			    console.log('token',token)
			} 
            uni.request({
                header,
                url,
                data,
                method,
                dataType,
                responseType,
                success(res) {
					console.log(res)
					uni.hideLoading();
					if (res.statusCode === 401) {
						console.log('11111',res.statusCode === 401)
						uni.showModal({
						    title: '提示',
						    content: '请先登录',
						    success: function (res) {
						        if (res.confirm) {
						            uni.navigateTo({
						            	url: '/pages/login/login',
						            })
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
						return
					}
					if (res.header && res.header.token) {
						console.log('headers.token000000', res.header.token)
					    uni.setStorageSync('token', res.header.token + "");
					}
					res = res.data || {};
                    if (!res.success) {
                        uni.showToast({
                            icon: 'none',
                            title: res.message || '服务器错误',
                        });
						 return
                    } 
                    resolve(res);
                },
                fail(err) {
                    uni.hideLoading();
					if (err && err.response) {
					    let message = ''
					    console.log('err.response.status' + err.response.status)
					    switch (err.response.status) {
					      case 401:
					        uni.showModal({
					          title: '请先登录',
					          success(res) {
					            if (res.confirm) {
					              uni.navigateTo({
					                url: '/pages/login/login',
					              })
					            } else if (res.cancel) {
					              console.log('用户点击取消')
					            }
					          }
					        })
					        message = ''
					        break
					      case 404:
					        message = ''
					        break
					      case 500:
					        message = '服务器内部错误'
					        break
					      case 501:
					        message = '网络未实现'
					        break;
					      case 502:
					        message = '网络错误'
					        break;
					      case 503:
					        message = '服务不可用'
					        break;
					      case 504:
					        message = '网络超时'
					        break;
					      case 505:
					      default:
					        message = 'error'
					        break;
					    }
					    if (message) {
					      uni.showToast({
					        title: message,
					      })
					    }
					  }
                    reject(err);
                }
            });
        });
    },
};