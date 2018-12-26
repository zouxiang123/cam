var assay_mapping = {
    /**
     * 初始化化验关联页面
     * 
     */
    init : function() {
        this.addEvents();
        $(window).resize();
        this.getXttDictList();
        this.getHospDictList();
    },
    addEvents : function() {
        // 动态设置高度
        $(window).on("resize", function() {
            $(".matching-list").height(window.innerHeight - 165);
            $("#doneTableDiv").css("max-height", $(window).height() - $("#doneTableDiv").offset().top - 180);
        });
        // 已匹配和未匹配之间的关联
        $("#typeDiv").on("click", "[data-type]", function() {
            var type = $(this).data("type");
            $(this).addClass("u-btn-blue").siblings().removeClass("u-btn-blue");
            $("[data-target]").each(function() {
                if ($(this).data("target") == type) {
                    $(this).removeClass("hide");
                } else {
                    $(this).addClass("hide");
                }
            })
        })
    },
    /**
     * 获取医院字典列表
     */
    getHospDictList : function() {
        $.ajax({
            url : ctx + "/assay/hospDict/listAllBasic.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                var bodyHtml = "";
                var mappedHtml = "";
                if (data.status == 1) {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        if (isEmpty(item.fkDictCode)) {// 未关联的项目
                            bodyHtml += '<tr>';
                            bodyHtml += '  <td class="xtt-4">';
                            bodyHtml += '    <label class="u-checkbox ml-4">';
                            bodyHtml += '      <input type="checkbox" value="' + convertEmpty(item.id) + '">';
                            bodyHtml += '      <span class="icon-checkbox"></span>';
                            bodyHtml += '    </label>';
                            bodyHtml += '    <input type="hidden" name="scalingFactor" value="' + convertEmpty(item.scalingFactor) + '">';
                            bodyHtml += '  </td>';
                            bodyHtml += '  <td class="xtt-14">' + convertEmpty(item.itemCode) + '</td>';
                            bodyHtml += '  <td class="">' + convertEmpty(item.itemName) + '</td>';
                            bodyHtml += '  <td class="xtt-8" data-unit>' + convertEmpty(item.unit) + '</td>';
                            bodyHtml += '</tr>';
                        } else {
                            mappedHtml += '<tr>';
                            mappedHtml += '  <td class="xtt-12">' + convertEmpty(item.itemCode) + '</td>';
                            mappedHtml += '  <td style="width: 50%">' + convertEmpty(item.itemName) + '</td>';
                            mappedHtml += '  <td class="xtt-14">' + convertEmpty(item.reference) + '</td>';
                            mappedHtml += '  <td class="xtt-10">' + convertEmpty(item.unit) + '</td>';
                            mappedHtml += '  <td class="xtt-14">' + convertEmpty(item.fkDictCode) + '</td>';
                            mappedHtml += '  <td style="width: 50%">' + convertEmpty(item.fkDictName) + '</td>';
                            mappedHtml += '  <td class="xtt-8">';
                            mappedHtml += '    <button type="button" text class="u-btn-red" onclick="assay_mapping.deleteMapping(' + item.id
                                            + ');">解除关联</button>';
                            mappedHtml += '  </td>';
                            mappedHtml += '</tr>';
                        }
                    }
                }
                $("#undoneHospDictBody").html(bodyHtml);
                $('#undoneHospDictSearch').fastLiveFilter('#undoneHospDictBody', {
                    timeout : 300
                });
                $("#doneBody").html(mappedHtml);
                $('#doneSearch').fastLiveFilter('#doneBody', {
                    timeout : 300
                });
                // 触发change事件
                $("#undoneHospDictSearch,#doneSearch").change();
            }
        });
    },
    /**
     * 获取血透字典类别
     */
    getXttDictList : function() {
        $.ajax({
            url : ctx + "/assay/assayMapping/getXttDictList.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                var bodyHtml = '';
                if (data.status == "1") {
                    for (var i = 0; i < data.rs.length; i++) {
                        var item = data.rs[i];
                        bodyHtml += '<tr>';
                        bodyHtml += '  <td class="xtt-4">';
                        bodyHtml += '    <label class="u-radio ml-4">';
                        bodyHtml += '      <input type="radio" name="xttDictItemCode" value="' + convertEmpty(item.itemCode) + '">';
                        bodyHtml += '      <span class="icon-radio"></span>';
                        bodyHtml += '    </label>';
                        bodyHtml += '  </td>';
                        bodyHtml += '  <td class="xtt-14">' + convertEmpty(item.itemCode) + '</td>';
                        bodyHtml += '  <td class="" data-name>' + convertEmpty(item.itemName) + '</td>';
                        bodyHtml += '  <td class="xtt-8" data-unit>' + convertEmpty(item.unit) + '</td>';
                        bodyHtml += '</tr>';
                    }
                }
                $("#undoneXttDictBody").html(bodyHtml);
                $('#undoneXttDictSearch').fastLiveFilter('#undoneXttDictBody', {
                    timeout : 300
                });
            }
        });
    },
    /**
     * 显示映射弹框
     */
    showMappingDialog : function() {
        var hospDictChecked = $("#undoneHospDictBody").find(":checkbox:checked");
        var xttDictChecked = $("#undoneXttDictBody").find(":radio:checked");
        if (hospDictChecked.length == 0 || xttDictChecked.length == 0) {
            showAlert("请选择需要关联的项目");
            return false;
        }
        var hospDictTr = $(hospDictChecked[0]).parents("tr");
        var hospDictUnit = hospDictTr.find("[data-unit]").text();
        var xttDictUnit = xttDictChecked.parents("tr").find("[data-unit]").text();
        $("#mappingHospUnit").html(hospDictUnit);
        $("#mappingXttUnit").html(xttDictUnit);
        $("#mappingScalingFactor").val(hospDictTr.find("input[name='scalingFactor']").val());
        popDialog("#mappingDialog");
    },
    /** 解除关联 */
    deleteMapping : function(id) {
        $.ajax({
            url : ctx + "/assay/assayMapping/deleteAssayMapping.shtml",
            type : "post",
            data : {
                id : id
            },
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    assay_mapping.getHospDictList();
                    showTips("解除关联成功");
                } else {
                    showTips(data.errmsg);
                }
            }
        });
    },
    /** 建立关联 */
    mapping : function() {
        var scalingFactor = $("#mappingScalingFactor").val();
        if (isEmpty(scalingFactor) || isNaN(scalingFactor)) {
            showWarn("换算系数的值不能为空，且必须是数字");
            return false;
        }
        var hospDictChecked = $("#undoneHospDictBody").find(":checkbox:checked");
        var xttDictChecked = $("#undoneXttDictBody").find(":radio:checked");
        var fkDictName = xttDictChecked.parents("tr").find("[data-name]").text();
        var param = {
            fkDictCode : xttDictChecked.val(),
            fkDictName : fkDictName,
            scalingFactor : scalingFactor
        };
        var ids = [];
        $.each(hospDictChecked, function() {
            ids.push($(this).val());
        });
        param.ids = ids;
        $.ajax({
            url : ctx + "/assay/assayMapping/mapping.shtml",
            type : "post",
            data : param,
            traditional : true,
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    assay_mapping.getHospDictList();
                    showTips("关联成功");
                    hiddenMe("#mappingDialog");
                } else {
                    showTips(data.errmsg);
                }
            }
        });
    },
    /**
     * 自动关联
     */
    autoMapping : function() {
        showWarn("自动关联是根据项目编号或者项目名称进行关联的，如果数据不对，请手动解除关联", function() {
            $.ajax({
                url : ctx + "/assay/assayMapping/autoMapping.shtml",
                type : "post",
                dataType : "json",
                success : function(data) {
                    if (data.status == "1") {
                        assay_mapping.getHospDictList();
                        showTips("自动关联成功");
                    } else {
                        showTips(data.errmsg);
                    }
                }
            });
        })
    }
};
