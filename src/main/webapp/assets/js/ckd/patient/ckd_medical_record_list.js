var ckd_medical_record_list = {
    init : function() {
        this.getList();
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        $.ajax({
            url : ctx + "/ckdMedicalRecord/list.shtml",
            data : "",
            type : "post",
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1" && !isEmptyObject(data.rs)) {
                    var html = '';
                    for (var i = 0; i < data.rs.length; i++) {
                        var item = data.rs[i];
                        html += '<div class="border-gray p-10 mt-12">';
                        html += '<div class="bb-dashed pb-8">';
                        html += '  <span class="fw-bold mr-40">日期：' + convertEmpty(item.recordDateStr) + '</span>';
                        html += '  <span class="fw-bold">用药名称：' + convertEmpty(item.medicalName) + '</span>';
                        if (hasPermission("CKD_medical_record")) {
                            html += '<button type="button" class="u-btn-blue u-float-r ml-16" onclick="ckd_medical_record_list.addOrEdit('
                                            + item.fkPatientId + ',' + item.id + ');" text>编辑</button>';
                        }
                        html += '<button type="button" class="u-btn-red u-float-r ml-16" onclick="ckd_medical_record_list.del(' + item.id
                                        + ');" text>删除</button>';

                        html += '</div>';
                        html += '<div class="pt-12 u-xt-12">';
                        html += '<div class="u-xt-6">剂量：' + convertEmpty(item.dosage) + '</div>';
                        html += '<div class="u-xt-6">数量：' + convertEmpty(item.ordernum) + '</div>';

                        html += '<div class="u-xt-6">频次：' + convertEmpty(item.frequencycode) + '</div>';
                        html += '<div class="u-xt-6">备注：' + convertEmpty(item.remark) + '</div>';

                        html += '</div>';
                        html += '</div>';
                    }
                    $("#recordList").html(html);
                }
            }
        });
    },
    /**
     * 新增或者修改操作
     */
    addOrEdit : function(patientId, id) {
        ckd_medical_record.show(patientId, $("#patientName").val(), function() {
            ckd_medical_record_list.getList();
        }, id);
    },
    /**
     * 删除记录
     * 
     * @param id
     */
    del : function(id) {
        showWarn("您确定要删除数据吗？", function() {
            $.ajax({
                url : ctx + "/ckdMedicalRecord/delete.shtml",
                data : "id=" + id,
                type : "post",
                dataType : "json",
                loading : true,
                success : function(data) {// ajax返回的数据
                    if (data.status == "1") {
                        ckd_medical_record_list.getList();
                    }
                }
            });
        });
    }
};