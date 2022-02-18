$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义查询的参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 定义时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDay());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + '- ' +
            hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 获取文章列表
    initArticleList();
    // 获取文章分类列表
    initCate();

    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // layer.msg('获取文章分类列表成功！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页
                renderPage(res.total);
            }
        })
    }

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

    // 为筛选表单绑定事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initArticleList();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调的方式有两种：
            // 1.点击页码
            // 2.laypage.render方法
            jump: function(obj, first) {
                // first是首次加载
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 根据最新的q查询参数获取对应数据
                if (!first) {
                    initArticleList();
                }
            }
        })
    }

    // 删除文章
    $('tbody').on('click', '.btn-del', function() {
        // 获取删除按钮的个数
        var len = $('.btn-del').length;
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 根据索引关闭弹出层
                    layer.close(index);
                    // 最后一页还有没有数据，没有数据就-1
                    if (len === 1) {
                        q.pagenum = q.pagenum > 1 ? --q.pagenum : 1;
                    }
                    initArticleList();
                }
            })
        });
    })


    // 编辑文章
    $('tbody').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + id;
        // layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
        //     //do something
        //     $.ajax({
        //         method: 'GET',
        //         url: '/my/article/delete/' + id,
        //         success: function(res) {
        //             if (res.status !== 0) {
        //                 return layer.msg('删除文章失败！');
        //             }
        //             layer.msg('删除文章成功！');
        //             // 根据索引关闭弹出层
        //             layer.close(index);
        //             // 最后一页还有没有数据，没有数据就-1
        //             if (len === 1) {
        //                 q.pagenum = q.pagenum > 1 ? --q.pagenum : 1;
        //             }
        //             initArticleList();
        //         }
        //     })
        // });
    })


})