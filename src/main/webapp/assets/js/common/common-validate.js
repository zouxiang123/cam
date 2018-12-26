//设置默认参数
$.validator.setDefaults({
    onfocusout : false,
    onkeyup : false,
    onclick : false,
    focusCleanup : true,
    errorClass : "error",
    errorElement : "span",
    ignore : ".ignore",
    showErrors : function(errorMap, errorList) {
        this.defaultShowErrors();
    }
});

// 身份证号码校验、身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
$.validator.addMethod("isIdCardNo", function(value, element, params) {
    if (isEmpty(value)) {
        return false;
    }
    var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    if (reg.test(value) === false) {
        return false;
    }
    return true;
}, jQuery.validator.format("请输入正确的身份证号码"));

// 自定义输入值范围包含边界customMin:[0,1,"字段名"]
$.validator.addMethod("customRange", function(value, element, params) {
    if (isEmpty(value)) {
        return true;
    }
    var min = params[0];
    var max = params[1];
    if (isNaN(min) || isNaN(max) || isNaN(value)) {
        return false;
    }
    var valueNo = Number(value);
    if (valueNo >= min && valueNo <= max) {
        return true;
    }
    return false;
}, jQuery.validator.format("“{2}”的值超出范围,应位于 {0} 和 {1} 之间"));

// 自定义最小输入值customMin:[0,"字段名"]
$.validator.addMethod("customMin", function(value, element, params) {
    if (isEmpty(value)) {
        return true;
    }
    var min = params[0];
    if (isNaN(min) || isNaN(value)) {
        return false;
    }
    var valueNo = Number(value);
    if (valueNo >= min) {
        return true;
    }
    return false;
}, jQuery.validator.format("“{1}”的值超出范围，应大于{0}"));

// 自定义最大输入值customMax:[1,"字段名"]
$.validator.addMethod("customMax", function(value, element, params) {
    if (isEmpty(value)) {
        return true;
    }
    var max = params[0];
    if (isNaN(max) || isNaN(value)) {
        return false;
    }
    var valueNo = Number(value);
    if (valueNo <= max) {
        return true;
    }
    return false;
}, jQuery.validator.format("“{1}”的值超出范围，应小于{0}"));

// 自定义最小字符串长度customMinlength:[1,"字段名"]
$.validator.addMethod("customMinlength", function(value, element, params) {
    if (isEmpty(value)) {
        return true;
    }
    var min = params[0];
    if (isNaN(min) || isEmpty(value)) {
        return false;
    }
    var length = value.length;
    if (length >= min) {
        return true;
    }
    return false;
}, jQuery.validator.format("“{1}”的值不合规范，应大于{0}个字符串"));

// 自定义最大字符串长度customMaxlength:[1,"字段名"]
$.validator.addMethod("customMaxlength", function(value, element, params) {
    if (isEmpty(value)) {
        return true;
    }
    var max = params[0];
    if (isNaN(max)) {
        return false;
    }
    var length = value.length;
    if (length <= max || isEmpty(value)) {
        return true;
    }
    return false;
}, jQuery.validator.format("“{1}”的值超出范围，应小于{0}个字符串"));

/*
 * 用途：检查输入字符串是否只由英文字母和数字组成
 */
$.validator.addMethod("isNumberOrLetter", function(value, element, params) {// 判断是否是数字或字母
    if (isEmpty(value)) {
        return true;
    }
    var regu = "^[0-9a-zA-Z]+$";
    var re = new RegExp(regu);
    if (re.test(value)) {
        return true;
    } else {
        return false;
    }
}, jQuery.validator.format("“{0}”的值不合规范，应由字母和数字组成"));

/*
 * 用途：检查输入字符串是否只由英文字母、数字或者_组成
 */
$.validator.addMethod("isNumberOr_Letter", function(value, element, params) {// 判断是否是数字或字母
    if (isEmpty(value)) {
        return true;
    }
    var regu = "^[0-9a-zA-Z\_]+$";
    var re = new RegExp(regu);
    if (re.test(value)) {
        return true;
    } else {
        return false;
    }
}, jQuery.validator.format("“{0}”的值不合规范，只能由字母、数字或_组成"));
/*
 * 判断是否为正整数
 */
$.validator.addMethod("isPInt", function(value, element, params) {
    if (isEmpty(value))
        return true;
    var g = /^[1-9]*[1-9][0-9]*$/;
    var re = new RegExp(g);
    if (re.test(value)) {
        return true;
    } else {
        return false;
    }
}, jQuery.validator.format("“{0}”的值不合规范，应为正整数"));
