// 每次调用ajax相关请求会先调用这个函数
// 这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})