$(function() {
    getUserInfo();

    $('#btnLogout').on('click', function() {
        // 弹出框
        layui.layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            //do something

            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            // location.replace('/login.html');
            location.href = '/login.html';

            layer.close(index);
        });
    })

})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(response) {
            if (response.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(response.data);
        }
    });
}
// 渲染头像
function renderAvatar(userInfo) {
    var name = userInfo.nickname || userInfo.username;
    $('#welcome').html('欢迎&nbsp;' + name);
    if (userInfo.user_pic) {
        $('.userinfo [class=layui-nav-img]').attr('src', userInfo.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }

}