// 每次调用ajax相关请求会先调用这个函数
// 这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    // 成功或失败都会调用
    options.complete = function(response) {
        if (response.responseJSON.status === 1 && response.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = '/login.html';
        }
    }


})