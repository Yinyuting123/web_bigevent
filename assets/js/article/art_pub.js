$(function() {
    var form = layui.form;
    var layer = layui.layer;

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 获取文章分类列表
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单
                form.render();
            }
        })
    }

    // 选择封面
    $('#btnChooseImage').on('click', function(e) {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择封面图片！');
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });


    var art_state = '已发布';

    // 草稿
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
        console.log(111);
    })


    // 监听表单提交事件
    $('#form-pub').on('submit', function(e) {
        console.log(1111);
        e.preventDefault();
        // 基于for表单创建formData对象
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 文件对象存储到formData
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // formData对象必须添加以下两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 成功之后回到列表
                window.parent.highlight('文章列表');
                location.href = '/article/art_list.html';
            }
        })
    }
})