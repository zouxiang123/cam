var propagandaReport = {};
$(function() {
    $(".u-pop-up-from").append($("#selectForm").andSelf());
    setReportDatePick($("#reportDateDiv"), {
        startInputName : "startDate",
        endInputName : "endDate",
        dateType : 'nothing',
        formId : 'selectForm',
        customForm : true,
        callback : function(d) {
            propagandaReport.selectPropagandaReport();
            var start = $('#startDate').val().replace(new RegExp("-", "g"), "/");
            var end = $('#endDate').val().replace(new RegExp("-", "g"), "/");
            if (start == '' && end == '') {
                $('#reportDate').val('全部');
            } else {
                $('#reportDate').val(start + '~' + end);
            }
        }
    });
});
// 高级赛选 搜索
propagandaReport.selectPropagandaReport = function() {
    var searchCond = $('#searchCond').val();
    if ('doctorAndNurse' == searchCond) {// 医护工作量
        propagandaReport.selectDoctorAndNurseWorks();
    } else if ('doctorAndNurseDetail' == searchCond) {// 医护工作量详情
        propagandaReport.selectDoctorAndNurseWorksDetail();
    } else if ('patient' == searchCond) {// 患者
        propagandaReport.selectPatient();
    } else if ('patientDetail' == searchCond) {// 患者详情
        propagandaReport.selectPatientDetail();
    } else if ('category' == searchCond) {// 宣教类别
        propagandaReport.selectCategory();
    } else if ('categoryDetail' == searchCond) {// 宣教类别详细
        propagandaReport.selectCategoryDetail();
    } else if ('categoryContentDetail' == searchCond) {// 宣教类别内容详细
        propagandaReport.selectCategoryContentDetail();
    }
}
// 医护工作量列表数据
propagandaReport.selectDoctorAndNurseWorks = function() {
    $.ajax({
        url : ctx + "/report/propaganda/selectDoctorAndNurseWorks.shtml",
        type : "post",
        data : $("#selectForm").serialize(),
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xtt-6">' + (parseInt(i) + 1) + '</td>';
                    html += '<td class="xtt-20">' + convertEmpty(list[i].operateName) + '</td>';
                    html += '<td>' + convertEmpty(list[i].total) + '</td>';
                    html += '<td class="xtt-10">';
                    html += '<button type="button" class="u-btn-blue" text onclick="propagandaReport.openTabPage(\'' + list[i].operateId + '\',\''
                                    + convertEmpty(list[i].operateName) + '\')">详情</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 医护工作量 -个人详情数据
propagandaReport.selectDoctorAndNurseWorksDetail = function() {
    var operateId = $('#primaryKey').val();
    $.ajax({
        url : ctx + "/report/propaganda/selectDoctorAndNurseWorksDetail.shtml",
        type : "post",
        data : $("#selectForm").serialize() + '&operateId=' + operateId,// $("#inOutStockForm").serialize(),
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xtt-20">' + convertEmpty(list[i].propagandaDateShow) + '</td>';
                    html += '<td class="xtt-18">' + convertEmpty(list[i].patientName) + '</td>';
                    html += '<td>' + convertEmpty(list[i].resourceTitle) + '</td>';
                    html += '<td class="xtt-16">' + convertEmpty(list[i].propagandaObjectName) + '</td>';
                    html += '<td class="xtt-16">' + convertEmpty(list[i].assessmentName) + '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 患者
propagandaReport.selectPatient = function() {
    $.ajax({
        url : ctx + "/report/propaganda/selectPatient.shtml",
        type : "post",
        data : $("#selectForm").serialize() + '&' + $('#patientQueryFrom').serialize(),
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs.patientList;
                $('#totalRecord').val(data.rs.entity.totalRecord);
                $('#pageNo').val(data.rs.entity.pageNo);
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xtt-6">' + (parseInt(i) + 1) + '</td>';
                    html += '<td class="xtt-20">' + convertEmpty(list[i].patientName) + '</td>';
                    html += '<td>' + convertEmpty(list[i].total) + '</td>';
                    html += '<td class="xtt-10">';
                    html += '<button type="button" class="u-btn-blue" text onclick="propagandaReport.openTabPage(\'' + list[i].fkPatientId + '\',\''
                                    + convertEmpty(list[i].patientName) + '\')">详情</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem : 'dataPaging', // id
                        count : $('#totalRecord').val(), // 数据总数
                        limit : $('#pageSize').val(),
                        curr : $('#pageNo').val(),
                        layout : [ 'prev', 'page', 'next', 'count' ],
                        theme : '#31AAFF',
                        jump : function(obj, first) {
                            // first首次进入
                            // obj 分页数据
                            if (!first) {
                                $('#pageNo').val(obj.curr);
                                propagandaReport.selectPatient();
                            }
                        }
                    });
                });
            }
        }
    });
}
// 患者 详情
propagandaReport.selectPatientDetail = function() {
    var fkPatientId = $('#primaryKey').val();
    $.ajax({
        url : ctx + "/report/propaganda/selectPatientDetail.shtml",
        data : $("#selectForm").serialize() + '&fkPatientId=' + fkPatientId,
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xtt-20">' + convertEmpty(list[i].propagandaDateShow) + '</td>';
                    html += '<td >' + convertEmpty(list[i].resourceTitle) + '</td>';
                    html += '<td class="xtt-16">' + convertEmpty(list[i].propagandaObjectName) + '</td>';
                    html += '<td class="xtt-16">' + convertEmpty(list[i].assessmentName) + '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 宣教类别
propagandaReport.selectCategory = function() {
    var fkPatientId = $('#primaryKey').val();
    $.ajax({
        url : ctx + "/report/propaganda/selectCategory.shtml",
        data : $("#selectForm").serialize(),
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xt-4">' + convertEmpty(list[i].categoryName) + '</td>';
                    html += '<td >' + convertEmpty(list[i].total) + '</td>';
                    html += '<td class="xtt-10">';
                    html += '<button type="button" class="u-btn-blue" text onclick="propagandaReport.openTabPage(\'' + list[i].fkCategoryId + '\',\''
                                    + convertEmpty(list[i].categoryName) + '\')">详情</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 宣教类别 详情
propagandaReport.selectCategoryDetail = function() {
    var fkCategoryId = $('#primaryKey').val();
    $.ajax({
        url : ctx + "/report/propaganda/selectCategoryDetail.shtml",
        data : $("#selectForm").serialize() + '&fkCategoryId=' + fkCategoryId,
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xt-4">' + convertEmpty(list[i].resourceTitle) + '</td>';
                    html += '<td >' + convertEmpty(list[i].total) + '</td>';
                    html += '<td class="xtt-10">';
                    html += '<button type="button" class="u-btn-blue" text onclick="propagandaReport.openTabPage(\'' + list[i].fkResourceId + '\',\''
                                    + convertEmpty(list[i].resourceTitle) + '\')">详情</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 宣教类别 内容 详情
propagandaReport.selectCategoryContentDetail = function() {
    var fkResourceId = $('#primaryKey').val();
    $.ajax({
        url : ctx + "/report/propaganda/selectCategoryContentDetail.shtml",
        data : $("#selectForm").serialize() + '&fkResourceId=' + fkResourceId,
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var list = data.rs;
                var html = '<table class="u-table u-table-bordered"><tbody>';
                for ( var i in list) {
                    html += '<tr>';
                    html += '<td class="xtt-14">' + convertEmpty(list[i].propagandaDateShow) + '</td>';
                    html += '<td class="xtt-12">' + convertEmpty(list[i].patientName) + '</td>';
                    html += '<td class="xtt-14">' + convertEmpty(list[i].propagandaObjectName) + '</td>';
                    html += '<td>' + convertEmpty(list[i].assessmentName) + '</td>';
                    html += '<td class="xtt-12">' + convertEmpty(list[i].operateName) + '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                $('#tableBody').html(html);
            }
        }
    });
}
// 打开tab页
propagandaReport.openTabPage = function(id, name) {
    var url = "";
    var searchCond = $('#searchCond').val();
    var data = '&' + $("#selectForm").serialize();
    if ('doctorAndNurse' == searchCond) {// 医护工作量详情
        url = ctx + '/report/propaganda/doctorAndNurseDetail.shtml?noStack=1&' + 'operateId=' + id + data;
        id = 'doctorAndNurseDetail_' + id;
    } else if ('patient' == searchCond) {// 患者详情
        url = ctx + '/report/propaganda/patientDetail.shtml?noStack=1&' + 'fkPatientId=' + id + data;
        id = 'patientDetail_' + id;
    } else if ('category' == searchCond) {// 分类详情
        url = ctx + '/report/propaganda/categoryDetail.shtml?noStack=1&' + 'fkCategoryId=' + id + data;
        id = 'categoryDetail_' + id;
    } else if ('categoryDetail' == searchCond) {// 分类内容详情
        url = ctx + '/report/propaganda/categoryContentDetail.shtml?noStack=1&' + 'fkResourceId=' + id + data;
        id = 'categoryContentDetail_' + id;
    }
    openUrl(id, name, url, '');
}
// 报表下载
propagandaReport.download = function() {
    // 高级赛选 搜索条件
    var searchCond = $('#searchCond').val();
    var data = '';
    if ('doctorAndNurse' == searchCond) {// 医护工作量
        data = $("#selectForm").serialize();
        window.location.href = ctx + "/report/propaganda/doctorAndNurseDownload.shtml?" + encodeURI(data);
    } else if ('doctorAndNurseDetail' == searchCond) {// 医护工作量详情
        data = $("#selectForm").serialize() + '&operateId=' + $('#primaryKey').val();
        window.location.href = ctx + "/report/propaganda/doctorAndNurseDetailDownload.shtml?" + encodeURI(data);
    } else if ('patient' == searchCond) {// 患者
        data = $("#selectForm").serialize() + "&patientName=" + $('#patientQueryFrom input[name="patientName"]').val();
        window.location.href = ctx + "/report/propaganda/patientDownload.shtml?" + encodeURI(data);
    } else if ('patientDetail' == searchCond) {// 患者详情
        data = $("#selectForm").serialize() + '&fkPatientId=' + $('#primaryKey').val();
        window.location.href = ctx + "/report/propaganda/patientDetailDownload.shtml?" + encodeURI(data);
    } else if ('category' == searchCond) {// 宣教类别
        data = $("#selectForm").serialize();
        window.location.href = ctx + "/report/propaganda/categoryDownload.shtml?" + encodeURI(data);
    } else if ('categoryDetail' == searchCond) {// 宣教类别详细
        data = $("#selectForm").serialize() + '&fkCategoryId=' + $('#primaryKey').val();
        window.location.href = ctx + "/report/propaganda/categoryDetailDownload.shtml?" + encodeURI(data);
    } else if ('categoryContentDetail' == searchCond) {// 宣教类别内容详细
        data = $("#selectForm").serialize() + '&fkResourceId=' + $('#primaryKey').val();
        window.location.href = ctx + "/report/propaganda/categoryContentDetailDownload.shtml?" + encodeURI(data);
    }
}
/**
 * 重置page页
 */
propagandaReport.resetPage = function() {
    $('#pageNo').val('1');
    $('#pageSize').val('25');
    $('#totalPage').val('0');
    $('#totalRecord').val('0');
}
// 赛选设置按钮 取消
$('#cancelDilog').click(function() {
    $("#serachDialog").hide();
});
// 赛选设置按钮 设置
$('#settingDialog').click(function() {
    $("#serachDialog").show();
});
// 查询 确定
$('#sure').click(function() {
    propagandaReport.selectPropagandaReport();
});
// 报表下载
$('#reportDownload').click(function() {
    propagandaReport.download();
});