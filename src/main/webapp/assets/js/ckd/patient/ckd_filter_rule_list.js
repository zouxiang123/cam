var ckd_filter_rule_list = {
    /**
     * 初始化
     * 
     * @param type
     *            默认类别
     */
    init : function(type) {
        ckd_filter_rule_list.getList();
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        var param = {};
        $.ajax({
            url : ctx + "/ckdFilterRule/list.shtml",
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                var html = "";
                if (data.status == "1" && !isEmptyObject(data.rs)) {
                    var items = data.rs;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        html += ckd_filter_rule_list.getHtml(item, i);
                    }
                }
                $("#tableBody").html(html);
            }
        });
    },
    /**
     * 获取单条记录的html
     * 
     * @param item
     * @param index
     */
    getHtml : function(item, index) {
        var html = '';
        html += '<tr data-patient="' + item.id + '" data-recordid="' + item.id + '" style="border: none;border-bottom: 1px solid #D9E0E6;">';
        html += '<td style="width:20%">' + item.suspectedDiagnosticName + '</td>';
        html += '<td style="width:70%">' + item.listStr + '</td>';
        html += '<td style="width:10%">';
        html += '<button type="button" class="u-btn-blue text-ellipsis" style="width:60px;" title="编辑" onclick="ckd_filter_rule_list.edit(\''
                        + item.id + '\')" text="">编辑</button>';
        html += '<button type="button" class="u-btn-red text-ellipsis" style="width:60px;" title="删除" onclick="ckd_filter_rule_list.del(\'' + item.id
                        + '\')" text="">删除</button>';
        html += '</td></tr>';
        return html;
    },

    /**
     * 新增或者修改操作
     */
    edit : function(id) {
        ckd_filter_rule_edit.show(id, function() {
            ckd_filter_rule_list.getList();
        });
    },

    /**
     * 删除
     */
    del : function(id) {
        showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
            $.ajax({
                url : ctx + "/ckdFilterRule/deleteById.shtml",
                type : "post",
                data : "id=" + id,
                dataType : "json",
                loading : true,
                success : function(data) {
                    if (data.status == "1") {
                        showTips("删除成功");
                        ckd_filter_rule_list.getList();
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        });
    }

};