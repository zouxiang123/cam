/** 报表异常提醒* */
/** 报表关闭条件* */
function reportConditionClose(titleFlag) {
    if (!isEmpty(titleFlag) && titleFlag) {
        $("#report_condition_title").hide();
    }
    $("#report_condition").hide();
}
/** 报表打开条件 */
function reportConditionOpen() {
    $("#report_condition_tip").addClass("hide");
    $("#report_condition").show();
}
/** 设置报表提示 */
function setReportConditionTips(tips) {
    $("#report_condition_tip").find('[data-text]').html(tips);
    $("#report_condition_tip").removeClass("hide");
}
