var form_template = {
    /**
     * 启动或者禁用
     * 
     * @param el
     * @param id
     */
    updateIsEnable : function(el, id) {
        var param = {
            id : id,
            isEnable : !$(el).data("flag")
        };
        $.ajax({
            url : ctx + "/fuFormTemplate/updateIsEnable.shtml",
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == "1") {
                    $(el).data("flag", param.isEnable);
                    $(el).text(param.isEnable ? "禁用" : "启用");
                    showTips("更新成功");
                }
            }
        });
    },
    /**
     * 上传模板
     * 
     * @param event
     */
    uploadTemplate : function(event, id) {
        console.log(event);
        var file = event.target.files[0];
        if (isEmptyObject(file)) {
            return;
        }
        if (file.name.lastIndexOf(".xml") == -1) {
            showWarn("无效的模板文件");
            return;
        }
        var formData = new FormData();
        formData.append('id', id);
        formData.append('file', file);
        $.ajax({
            url : ctx + "/fuFormTemplate/uploadTemplate.shtml",
            type : "post",
            data : formData,
            dataType : "json",
            contentType : false, // 不设置内容类型
            processData : false, // 不处理数据
            success : function(data) {
                if (data.status == "1") {
                    showTips("上传成功");
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    }
};