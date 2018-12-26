var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        ckd_filter_list.init();
    });
});

var ckd_filter_list = {
    /** 疑似患者url */
    patient_emr_url : "/ckdFilter/view.shtml",
    /** 获取患者列表数据对应的url */
    patient_list_url : "/ckdFilter/list.shtml",
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
        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setMonth(date.getMonth() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("input[name='startDateStr']").val(startDate)
        $("input[name='endDateStr']").val(endDate);
        laydate.render({
            elem : "#startDateStr",
            value : startDate,
            theme : '#31AAFF',
            btns : [ "now", "confirm" ],
            done : function(value) {
                $("input[name='startDateStr']").val(value)
                var intervalMonth = ckd_filter_list.checkDate(value, $("input[name='endDateStr']").val());
                if (intervalMonth > 12) {
                    return showWarn("日期相隔不能超过一年");
                }
                ckd_filter_list.getPatients();
            }
        });
        laydate.render({
            elem : "#endDateStr",
            value : endDate,
            theme : '#31AAFF',
            btns : [ "now", "confirm" ],
            done : function(value) {
                $("input[name='endDateStr']").val(value)
                var intervalMonth = ckd_filter_list.checkDate($("input[name='startDateStr']").val(), value);
                if (intervalMonth > 12) {
                    return showWarn("日期相隔不能超过一年");
                }
                ckd_filter_list.getPatients();
            }
        });

        ckd_filter_list.getPatients();
        ckd_filter_list.addEvents();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $("#patientSearch").on("change", function() {
            ckd_filter_list.getPatients();
        });
    },
    /**
     * 获取患者列表
     */
    getPatients : function() {
        var name = $("#patientSearch").val();
        var startDateStr = $("input[name='startDateStr']").val();
        var endDateStr = $("input[name='endDateStr']").val();
        var param = {
            stdDisgnosisName : name,
            startDateStr : startDateStr,
            endDateStr : endDateStr
        };

        $.extend(param, isEmptyObject(ckd_filter_list.currentPageParam) ? this.defaultPageParam : ckd_filter_list.currentPageParam);
        var url = ckd_filter_list.patient_list_url;
        $.ajax({
            url : ctx + url,
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                ckd_filter_list.moreBtns = {}; // clear Cache
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
                        html += ckd_filter_list.getPatientHtml(item, i);
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
                                ckd_filter_list.currentPageParam = {
                                    pageNo : obj.curr,
                                    pageSize : obj.limit
                                };
                                ckd_filter_list.getPatients();
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
    getPatientHtml : function(item, index) {
        var html = '';
        html += '<tr data-patient="' + item.id + '" data-recordid="' + item.id + '" style="border: none;border-bottom: 1px solid #D9E0E6;">';
        html += '<td style="width:5%">' + item.ptName + '</td>';
        html += '<td style="width:3%">' + item.ptSex + '</td>';
        html += '<td style="width:3%">' + convertEmpty(item.ptAge) + '</td>';
        html += '<td style="width:4%">' + convertEmpty(item.visitNo) + '</td>';
        html += '<td style="width:9%">' + convertEmpty(item.idNumber) + '</td>';
        html += '<td style="width:6%">' + convertEmpty(item.ptPhoneNumber) + '</td>';
        html += '<td style="width:18%">' + convertEmpty(item.stdDisgnosisName) + '</td>';
        html += '<td style="width:5%">' + convertEmpty(item.stdDisgnosisCode) + '</td>';
        html += '<td style="width:8%">' + convertEmpty(item.inDept) + '</td>';
        html += '<td style="width:5%">' + convertEmpty(item.outDept) + '</td>';
        html += '<td style="width:6%">' + convertEmpty(item.visitDate) + '</td>';
        html += '<td style="width:8%">';
        html += '<button type="button" class="u-btn-blue text-ellipsis" style="width:60px;" title="查看病历" onclick="ckd_filter_list.openUrl(\''
                        + item.urlAddr + '\')" text="">查看病历</button>';
        html += '<button type="button" class="u-btn-blue text-ellipsis" style="width:60px;" title="转慢病" onclick="ckd_filter_list.openUrlStr(\''
                        + item.id + '\')" text="">转慢病</button>';
        html += '</td></tr>';
        return html;
    },
    /*
     * 查看病历
     */
    openUrl : function(url) {
        url = url.replace(/&/g, "separator");
        window.open('alert:' + url, "_self");
    },
    /*
     * 转慢病
     */
    openUrlStr : function(id) {
        var url = ctx + "/ckdFilter/editPatient.shtml?id=" + id;
        window.location.href = url;
    },
    /*
     * 日期相隔不能大于一年
     */
    checkDate : function(startDateStr, endDateStr) {
        var startDate = new Date(startDateStr);
        var endDate = new Date(endDateStr);
        var startMonth = startDate.getMonth();
        var endMonth = endDate.getMonth();
        var intervalMonth = (endDate.getFullYear() * 12 + endMonth) - (startDate.getFullYear() * 12 + startMonth);
        return intervalMonth;
    }

};