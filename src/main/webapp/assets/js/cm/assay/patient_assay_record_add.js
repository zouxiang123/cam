$(function() {
    assay_record_add.init();
});
var assay_record_add = {
    callback : null,
    action : null,// save update
    patientId : null,
    init : function() {
        this.addEvents();
        this.addValidate();
    },
    addEvents : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            laydate.render({
                elem : "#patientAssayRecordAddAssayDate",
                theme : '#31AAFF',
                value : new Date().pattern("yyyy-MM-dd"),
                btns : [ "now", "confirm" ],
                done : function(value) {
                    $("#assayHistReportSearch").find(":radio").prop("checked", false);
                }
            });
        });
        // 选中类型
        $("#patientAssayRecordAddGroupList").on("change", function() {
            assay_record_add.getItems();
        });
    },
    /**
     * 显示添加dialog
     * 
     * @param patientId
     * @param callback
     *            保存后回调
     */
    show : function(patientId, callback) {
        this.action = 'save';
        this.callback = callback;
        this.patientId = patientId;
        $("#patientAssayRecordAddTitle").text("添加化验项信息");
        /** 获取化验单类别数据 */
        $.ajax({
            url : ctx + "/assay/hospDict/listManualAddGroup.shtml",
            type : "post",
            dataType : "json",
            loading : true,
            success : function(data) {
                var htmlSelect = '';
                if (data.status == 1) {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        htmlSelect += '<option value="' + item.groupId + '">' + item.groupName + '</option>';
                    }
                }
                $("#patientAssayRecordAddGroupList").html(htmlSelect);
                // 触发change事件，获取化验项目数据
                $("#patientAssayRecordAddGroupList").change();
            }
        });
        popDialog("#patientAssayRecordAddDialog");
    },
    /**
     * 显示编辑dialog
     * 
     * @param reqId
     * @param patientId
     * @param callback
     *            删除，保存后回调
     */
    edit : function(reqId, patientId, callback) {
        this.action = 'update';
        this.callback = callback;
        this.patientId = patientId;
        $("#patientAssayRecordAddTitle").text("编辑化验项信息");
        $.ajax({
            url : ctx + "/assay/patientAssayRecord/selectByReqId.shtml",
            type : "post",
            data : {
                reqId : reqId,
                fkPatientId : patientId
            },
            dataType : "json",
            success : function(data) {
                $("#patientAssayRecordAddGroupList").html("");
                if (data.status == "1") {
                    var patientAssayList = data.patientAssayList;
                    assay_record_add.getItemsHtml(patientAssayList);
                    if (patientAssayList.length != 0) {
                        var item = patientAssayList[0];
                        $("#patientAssayRecordAddGroupList").html('<option value="' + item.groupId + '">' + item.groupName + '</option>');
                        $("#patientAssayRecordAddAssayDate").val(new Date(item.assayDate).pattern("yyyy-MM-dd"));
                    }
                }
                popDialog("#patientAssayRecordAddDialog");
            }
        });
    },
    /**
     * 保存化验数据
     * 
     * @returns {Boolean}
     */
    save : function() {
        if (!$("#patientAssayRecordAddForm").valid()) {
            return false;
        }
        var items = [];
        var assayDateStr = $("#patientAssayRecordAddAssayDate").val();
        var patientId = this.patientId;
        $("#patientAssayRecordAddBody").find("tr").each(function() {
            var item = {};
            $(this).find("[data-val]").each(function() {
                var key = $(this).data("val");
                item[key] = $(this).val();
            });
            item.assayDateStr = assayDateStr;
            item.fkPatientId = patientId;
            items.push(item);
        });
        if (items.length == 0) {
            showTips("没有需要保存的化验项");
            return false;
        }
        var url = "";
        if (this.action == "save") {// 新增
            url = ctx + "/assay/patientAssayRecord/insertPatientAssay.shtml";
        } else {
            url = ctx + "/assay/patientAssayRecord/updatePatientAssay.shtml";
        }
        $.ajax({
            url : url,
            type : "post",
            data : JSON.stringify(items),
            dataType : "json",
            contentType : "application/json",
            success : function(data) {
                if (data.status == "1") {
                    showTips("保存成功");
                    if (!isEmpty(assay_record_add.callback)) {
                        assay_record_add.callback();
                    }
                    hiddenMe("#patientAssayRecordAddDialog");
                }
            }
        });
    },
    /**
     * 删除数据
     * 
     * @param el
     * @param id
     */
    del : function(el, id) {
        $.ajax({
            url : ctx + "/assay/patientAssayRecord/deleteById.shtml",
            type : "post",
            data : "id=" + id,
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    $(el).parents("tr").remove();
                    showTips("删除成功");
                    if (!isEmpty(assay_record_add.callback)) {
                        assay_record_add.callback();
                    }
                    if ($("#patientAssayRecordAddBody").find("tr").length == 0) {// 所有数据都被删除了，隐藏dialog
                        hiddenMe("#patientAssayRecordAddDialog");
                    }
                }
            }
        });
    },
    /** 获取table数据 */
    getItems : function() {
        var groupId = $("#patientAssayRecordAddGroupList").val();
        if (isEmpty(groupId)) {
            $("#patientAssayRecordAddBody").empty();
        } else {
            $.ajax({
                url : ctx + "/assay/hospDict/getAssayList.shtml",
                type : "post",
                data : {
                    groupId : groupId
                },
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        for (var i = 0; i < data.items.length; i++) {// 新增项目的参考值由参考值加单位组成
                            var item = data.items[i];
                            item.reference = convertEmpty(item.reference) + convertEmpty(item.unit);
                        }
                        assay_record_add.getItemsHtml(data.items);
                    }
                }
            });
        }
    },
    /**
     * 获取items对应的html
     * 
     * @param items
     */
    getItemsHtml : function(items) {
        var html = "";
        var action = this.action;
        if (!isEmptyObject(items)) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                html += '<tr>';
                html += '<input type="hidden" data-val="id" value=' + convertEmpty(item.id) + '>';
                html += '<input type="hidden" data-val="groupId" value="' + convertEmpty(item.groupId) + '" />';
                html += '<input type="hidden" data-val="groupName" value="' + convertEmpty(item.groupName) + '" />';
                html += '<input type="hidden" data-val="itemName" value=' + convertEmpty(item.itemName) + '>';
                html += '<input type="hidden" data-val="itemCode" value=' + convertEmpty(item.itemCode) + '>';
                html += '<input type="hidden" data-val="reqId" value="' + convertEmpty(item.reqId) + '" />';
                html += '<input type="hidden" data-val="reference" value="' + convertEmpty(item.reference) + '">';
                html += '<input type="hidden" data-val="unit" value=' + convertEmpty(item.unit) + '>';
                html += '<input type="hidden" data-val="minValue" value=' + convertEmpty(item.minValue) + '>';
                html += '<input type="hidden" data-val="maxValue" value=' + convertEmpty(item.maxValue) + '>';
                html += '<input type="hidden" data-val="valueType" value=' + convertEmpty(item.valueType) + '>';
                html += '<td>' + item.itemName + '</td>';
                html += '<td>' + item.itemCode + '</td>';
                var validHtml = 'required data-msg-required="“' + item.itemName + '”的值不能为空"';
                if (item.valueType == 1) {
                    validHtml += ' data-rule-number=true data-msg-number="“' + item.itemName + '”的值不是有效的数字"';
                }
                html += '<td><input type="text" class="w-90-imp" name="patientAssayRecordAddResult' + i + '" data-val="result" value="'
                                + convertEmpty(item.result) + '" ' + validHtml + ' ></td>';
                html += '<td>' + convertEmpty(item.reference) + '</td>';
                html += '<td>';
                if (action == "update") {
                    html += '<button type="button" class="u-btn-red" onclick="assay_record_add.del(this,' + item.id + ');" text>删除</button>';
                }
                html += '</td>';
                html += '</tr>';
            }
        }
        $("#patientAssayRecordAddBody").html(html);
    },
    addValidate : function() {
        $('#patientAssayRecordAddForm').validate({
            rules : {
                assayDate : {
                    required : [ "日期" ]
                }
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorDisplayEl($(element));
                $(error).css("display", "block");
                obj.find("[data-error]").append(error);
            }
        });
    }
};