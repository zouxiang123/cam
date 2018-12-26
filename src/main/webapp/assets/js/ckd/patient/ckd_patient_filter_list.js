var laydate = null;
$(function() {
    ckd_patient_filter_list.init();
});

var ckd_patient_filter_list = {
    /** 获取筛查结果列表数据对应的url */
    patient_list_url : "/ckdPatientFilter/list.shtml",
    currentPageParam : null,
    defaultPageParam : {
        pageNo : 1,
        pageSize : 25,
    },
    /**
     * 初始化
     * 
     * @param type
     *            默认类别
     */
    init : function(type) {
        ckd_patient_filter_list.getList();
        ckd_patient_filter_list.addEvents();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 搜索
        $("#patientSearch").on("change", function() {
            ckd_patient_filter_list.getList();
        });
        $(".static-head-er1 ul li").click(function(event) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            ckd_patient_filter_list.getList();
            if ($(this).attr("data-code") == "0") {
                $(".btn-delete").show();
                $(".btn-care").show();
            } else {
                $(".btn-delete").hide();
                $(".btn-care").hide();
            }
        });
        // 批量关注
        $(".btn-care").click(function() {
            var ids = new Array();
            $("#tableBody input[type='checkbox']:checked").each(function(index) {
                ids[index] = $(this).val();
            })
            if (ids.length == 0) {
                return showWarn("请选择关注的患者！");
            }
            $.ajax({
                url : ctx + "/ckdPatientFilter/batchAttention.shtml",
                type : "post",
                data : "ids=" + ids,
                dataType : "json",
                loading : true,
                success : function(data) {
                    if (data.status == "1") {
                        ckd_patient_filter_list.getList();
                    }
                }
            });
        });

        // 批量删除
        $(".btn-delete").click(function() {
            var ids = new Array();
            $("#tableBody input[type='checkbox']:checked").each(function(index) {
                ids[index] = $(this).val();
            })
            if (ids.length == 0) {
                return showWarn("请选择删除的患者！");
            }
            $.ajax({
                url : ctx + "/ckdPatientFilter/updateDelFlagByIds.shtml",
                type : "post",
                data : "ids=" + ids,
                dataType : "json",
                loading : true,
                success : function(data) {
                    if (data.status == "1") {
                        ckd_patient_filter_list.getList();
                    }
                }
            });
        });
        // 全选
        $("#ischeckAll").click(function() {
            if ($(this).is(":checked")) {
                $("#tableBody input[type='checkbox']").attr("checked", true);
            } else {
                $("#tableBody input[type='checkbox']").attr("checked", false);
            }
        });
    },
    /**
     * 获取筛查患者列表
     */
    getList : function() {
        $("#ischeckAll").attr("checked", false);
        var name = $("#patientSearch").val();
        var code = $(".static-head-er1 .active").attr("data-code");
        var status = 0;
        var delFlag = false;
        if (code == "1") {// 关注
            status = 1;
        }
        if (code == "2") {// 已删除
            delFlag = true;
            status = null;
        }
        var param = {
            name : name,
            status : status,
            delFlag : delFlag
        };

        $.extend(param, isEmptyObject(ckd_patient_filter_list.currentPageParam) ? this.defaultPageParam : ckd_patient_filter_list.currentPageParam);
        var url = ckd_patient_filter_list.patient_list_url;
        $.ajax({
            url : ctx + url,
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                ckd_patient_filter_list.moreBtns = {}; // clear Cache
                var html = "";
                var totalRecord = 0;
                var pageNo = 0;
                if (data.status == "1" && !isEmptyObject(data.rs)) {
                    totalRecord = data.rs.totalRecord;
                    pageNo = data.rs.pageNo;
                    var items = data.rs.results;
                    var patientCount = data.rs;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        html += ckd_patient_filter_list.getHtml(item, i);
                    }
                }
                $("#tableBody").html(html);
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem : 'pagingDiv', // id
                        count : totalRecord, // 数据总数
                        limit : param.pageSize,
                        curr : pageNo,
                        layout : [ 'prev', 'page', 'next', 'count' ],
                        // groups : 4,
                        theme : '#31AAFF',
                        jump : function(obj, first) {
                            if (!first) {
                                ckd_patient_filter_list.currentPageParam = {
                                    pageNo : obj.curr,
                                    pageSize : obj.limit
                                };
                                ckd_patient_filter_list.getList();
                            }
                        }
                    });
                });
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
        html += '<tr>';
        html += '<td class="xtt-4"><label class="u-checkbox" ><input type="checkbox" name="id" value="' + item.id
                        + '"><span class="icon-checkbox"></span></label></td>';
        html += '<td class="xtt-12">' + new Date(item.visitDate).pattern("yyyy-MM-dd") + '</td>';
        html += '<td class="xtt-8"><a class="u-btn-blue" href="' + item.urlAddr + '" target="_blank">' + item.name + '</a></td>';
        html += '<td class="xtt-14">' + convertEmpty(item.idNumber) + '</td>';
        html += '<td class="xtt-7">' + item.sex + '</td>';
        html += '<td class="xtt-7">' + convertEmpty(item.age) + '</td>';
        html += '<td>' + convertEmpty(item.disgnosisName) + '</td>';
        html += '<td class="xtt-12">' + convertEmpty(item.currDeptName) + '</td>';
        html += '<td class="xtt-12">' + convertEmpty(item.doctor) + '</td>';
        html += '<td class="xtt-12">';
        if (item.delFlag) {// 已删除
            html += '<button type="button" class="xtt-blue xtt-text" style="padding: 0" onclick="ckd_patient_filter_list.update(\'' + item.id
                            + '\',3)" text="">恢复</button>';
            html += '<button type="button" class="xtt-text xtt-red" style="margin-left:15px;" onclick="ckd_patient_filter_list.remove(\'' + item.id
                            + '\',2)" text="">彻底删除</button>';
        } else {
            if (item.status == 0) {// 待处理
                html += '<button type="button" class="xtt-blue xtt-text" style="padding: 0" onclick="ckd_patient_filter_list.update(\'' + item.id
                                + '\',1)" text="">关注</button>';
                html += '<button type="button" class="xtt-text xtt-red" style="margin-left:15px;" onclick="ckd_patient_filter_list.update(\''
                                + item.id + '\',2)" text="">删除</button>';
            } else if (item.status == 1) {// 已关注
                html += '<button type="button" class="xtt-blue xtt-text" style="padding: 0" onclick="ckd_patient_filter_list.openUrlStr(\'' + item.id
                                + '\')" text="">转入</button>';
                html += '<button type="button" class="xtt-text xtt-red" style="margin-left:15px;" onclick="ckd_patient_filter_list.update(\''
                                + item.id + '\',0)" text="">取消关注</button>';
            }
        }
        html += '</td>';
        html += '</tr>';
        return html;
    },
    /*
     * 关注删除
     */
    update : function(id, type) {
        var param = "id=" + id;
        if (type == 0) {// 取消
            param += "&status=0";
        }
        if (type == 1) {// 关注
            param += "&status=1";
        }
        if (type == 2) {// 删除
            param += "&delFlag=true";
        }
        if (type == 3) {// 恢复
            param += "&delFlag=false";
        }
        $.ajax({
            url : ctx + "/ckdPatientFilter/update.shtml",
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == "1") {
                    ckd_patient_filter_list.getList();
                }
            }
        });
    },
    /*
     * 转慢病
     */
    openUrlStr : function(id) {
        var url = ctx + "/ckdPatientFilter/editPatient.shtml?id=" + id;
        window.location.href = url;
    },
    /**
     * 彻底删除
     */
    remove : function(id) {
        showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
            $.ajax({
                url : ctx + "/ckdPatientFilter/remove.shtml",
                type : "post",
                data : "id=" + id,
                dataType : "json",
                loading : true,
                success : function(data) {
                    if (data.status == "1") {
                        ckd_patient_filter_list.getList();
                    }
                }
            });
        });
    }
};