(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery", "../jquery.validate" ], factory);
    } else {
        factory(jQuery);
    }
}(function($) {

    /*
     * Translated default messages for the jQuery validation plugin. Locale: ZH
     * (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
     */
    $.extend($.validator.messages, {
        required : jQuery.validator.format("“{0}”不能为空"),
        remote : "请修正该字段",
        email : "请输入正确格式的电子邮件",
        url : "请输入合法的网址",
        date : jQuery.validator.format("“{0}”不是合法的日期"),
        dateISO : "“{0}”不是合法的日期",
        number : jQuery.validator.format("“{0}”不是合法的数字"),
        digits : jQuery.validator.format("“{0}”只能输入整数"),
        creditcard : "请输入合法的信用卡号",
        equalTo : "请再次输入相同的值",
        accept : "请输入拥有合法后缀名的字符串",
        maxlength : jQuery.validator.format("请输入一个 长度最多是 “{0}” 的字符串"),
        minlength : jQuery.validator.format("请输入一个 长度最少是 “{0}” 的字符串"),
        rangelength : jQuery.validator.format("请输入 一个长度介于 “{0}” 和 “{1}” 之间的字符串"),
        range : jQuery.validator.format("请输入一个介于 “{0}” 和 “{1}” 之间的值"),
        max : jQuery.validator.format("请输入一个最大为“{0}” 的值"),
        min : jQuery.validator.format("请输入一个最小为“{0}” 的值")
    });

}));