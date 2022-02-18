$(function() {

    var layer = layui.layer;
    var form = layui.form;

    // 获取文章分类列表
    initArticlecateList();

    function initArticlecateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                // layer.msg('获取文章分类列表成功！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    })


    // 通过代理的形式绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类别失败！');
                }
                initArticlecateList();
                layer.msg('新增文章类别成功！');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出修改文章分类层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        });
        // 获取对应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                form.val('formArticleInfo', res.data);
            }
        })
    })

    // 通过代理的形式绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类信息失败！');
                }
                initArticlecateList();
                layer.msg('更新文章分类信息成功！');
                // 根据索引关闭弹出层
                layer.close(indexEdit);
            }
        })
    })

    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    // 根据索引关闭弹出层
                    layer.close(index);
                    initArticlecateList();
                }
            })
        });
    })

})