var ckd_drugs_record_list = {
    init : function(isPreview) {
        this.addEvents();
        this.getList();
    },
    addEvents : function() {
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        $.ajax({
            url : ctx + "/ckdDrugsRecord/list.shtml",
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
                        html += '  <span class="fw-bold mr-40">记录人：' + convertEmpty(item.createUserName) + '</span>';
                        html += '  <span class="fw-bold">药品名：' + convertEmpty(item.drugsType) + '</span>';
                        if (hasPermission("CKD_drugs_record")) {
                            html += '<button type="button" class="u-btn-blue u-float-r ml-16" onclick="ckd_drugs_record_list.addOrEdit('
                                            + item.fkPatientId + ',' + item.id + ');" text>编辑</button>';
                        }
                        html += '<button type="button" class="u-btn-red u-float-r ml-16" onclick="ckd_drugs_record_list.del(' + item.id
                                        + ');" text>删除</button>';

                        html += '</div>';
                        html += '<div class="pt-12 u-xt-12">';
                        if (!isEmpty(item.tripterygiumGlycosides)) {
                            html += '<div class="u-xt-6">雷公藤多苷：' + convertEmpty(item.tripterygiumGlycosides) + '</div>';
                            html += '<div class="u-xt-6">ACEI/ARB：' + convertEmpty(item.aceiArb) + '</div>';
                        } else {
                            html += '<div class="u-xt-6">甲泼尼龙/泼尼龙：' + convertEmpty(item.spiltNylon) + '</div>';
                            html += '<div class="u-xt-6">免疫抑制剂：' + convertEmpty(item.immunosuppressant) + '</div>';
                        }

                        html += '</div>';
                        html += '<div class="pt-12 u-xt-6">24H尿蛋白定量：' + convertEmpty(item.urinaryProteinQuantification) + '</div>';
                        html += '<div class="pt-12 u-xt-6">蛋白：' + convertEmpty(item.protein) + '</div>';

                        html += '<div class="pt-12 u-xt-12">';
                        html += '<div class="u-xt-6">血白：' + convertEmpty(item.bloodWhite) + '</div>';
                        html += '<div class="u-xt-6">血常规：' + convertEmpty(item.routineBloodTest) + '</div>';
                        html += '</div>';

                        html += '<div class="pt-12 u-xt-12">';
                        html += '<div class="u-xt-6">肝功能：' + convertEmpty(item.liver) + '</div>';
                        html += '<div class="u-xt-6">肾功能：' + convertEmpty(item.renal) + '</div>';
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
        showIframeDialog({
            title1 : "患者：" + $("#patientName").val(),
            title : (isEmpty(id) ? "新增" : "编辑") + "药品观察记录",
            url : ctx + "/ckdDrugsRecord/view.shtml?fkPatientId=" + patientId + (isEmpty(id) ? "" : "&id=" + id),
            saveCall : function(iframeWin) {
                iframeWin.ckd_drugs_record.save(function(id) {
                    hiddenMe("#iframeDialog");
                    ckd_drugs_record_list.getList();
                });
            }
        });

    },
    /**
     * 删除记录
     * 
     * @param id
     */
    del : function(id) {
        showWarn("您确定要删除数据吗？", function() {
            $.ajax({
                url : ctx + "/ckdDrugsRecord/delete.shtml",
                data : "id=" + id,
                type : "post",
                dataType : "json",
                loading : true,
                success : function(data) {// ajax返回的数据
                    if (data.status == "1") {
                        ckd_drugs_record_list.getList();
                    }
                }
            });
        });
    }
};