$(function() {
    // 去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 去登录
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 自定义密码验证规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            // 校验两次密码是否一致的规则
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    })


    // 监听注册表单
    $('#form-reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }

        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击行为
                $('#link_login').click();
            }
        );
    })

    // 监听登录表单
    $('#form-login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 将登陆成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', response.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        });
    })

})