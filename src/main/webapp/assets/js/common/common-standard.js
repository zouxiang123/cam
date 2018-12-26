/**
 * 导航栏切换事件注册
 */
$(document).ready(function() {
    // 添加公共事件
    addCommonEvents();
    // 隐藏或显示iframe的内容
    showOrHideIframe();
    // 设置头像文字长度
    $(".u-image").each(function() {
        $(this).text(getImageName($(this).text()));
    });
});

function addCommonEvents() {
    document.onkeydown = function(e) {
        e = e || event;
        if (e.keyCode == 116) {
            e.preventDefault(); // 组织默认刷新
            if (window.top == window.self) {
                if ($("#frameBody").size() == 0) {
                    location.reload(true);
                } else {
                    var iframeWindow = $("#frameBody")[0].contentWindow || $("#frameBody")[0];
                    $("#frameBody").attr("src", iframeWindow.location.href);
                    // $("#frameBody").attr("src", $("#frameBody").attr("src"));
                }
            } else {
                location.reload(true);
                // $("#frameBody", window.parent.document).attr("src",
                // $("#frameBody", window.parent.document).attr("src"));
            }
        }
    };
    // 如果引用了select2，拓展其搜索功能
    if (!isEmptyObject($.fn.select2)) {
        var s2DefaultMatcher = $.fn.select2.defaults.defaults.matcher;
        $.fn.select2.defaults.set("matcher", function(params, data) {
            var result = s2DefaultMatcher(params, data);
            if (result != null) {
                return result;
            }
            var origin = $(data.element).data("search") + "";// match search
            if (!isEmpty(origin) && origin.toUpperCase().indexOf(params.term.toUpperCase()) > -1) {
                return data;
            }
            return null;
        });
    }
}
/** textarea 添加自动伸缩 */
function addTextareaAutoHeightEvent(element) {
    $(element).unbind("focus").bind("focus", function() {
        window.activeobj = this;
        this.clock = setInterval(function() {
            // if (activeobj.scrollHeight < 40) {
            // clearInterval(window.activeobj.clock);
            // }
            activeobj.style.height = activeobj.scrollHeight + 'px';
        }, 10);
    });
    // $(element).unbind("propertychange input").bind("propertychange input",
    // function() {
    // this.style.height = this.scrollHeight + 'px';
    // });
    $(element).unbind("blur").bind("blur", function() {
        clearInterval(this.clock);
    });
}
/**
 * 根据名称，获取图片显示名称
 * 
 * @param name
 */
function getImageName(name) {
    if (!isEmpty(name) && name.length > 2) {
        return name.substring(name.length - 2, name.length);
    } else {
        return name;
    }
}

/**
 * 使用button 提交 form 避免enter键直接提交
 * 
 * @param btn
 */
function buttonSubmit(btn) {
    /* 表单校验 */
    if ($(btn.form).valid()) {
        if (isEmpty(btn.form.onsubmit)) {
            btn.form.submit();
        } else {
            btn.form.onsubmit();
        }
    }
}

/**
 * 生成导航面包屑
 */
function setBreadcrumb(menu) {
    if (isEmpty(menu)) {
        return;
    }
    var menuHtml = "";
    for ( var key in menu) {
        if (isEmpty(menu[key])) {
            menuHtml += '<li class="active">' + key + '</a></li>';
        } else {
            menuHtml += '<li><a href="' + menu[key] + '">' + key + '</a></li>';
        }
    }
    $("#breadcrumb").children("li").remove();
    $("#breadcrumb").append(menuHtml);
    return;

}

/**
 * 显示系统dialog
 * 
 * @param errorMap
 */
function showSystemDialog(errorMap, type) {
    if (isEmpty(type)) {
        type = 'info';
    }
    if (!isEmptyObject(errorMap)) {
        var content = "";
        for ( var key in errorMap) {
            content += errorMap[key] + "<br>";
        }
        system_dialog.show({
            level : type,
            content : content
        });
    }
}

/**
 * 显示系统dialog alert
 * 
 * @param message
 *            显示信息
 */
function showWarn(message, callback, element) {
    if (!isEmpty(element)) {
        element.select();
        return;
    }
    system_dialog.show({
        level : "warn",
        content : message,
        confirmCall : callback
    });
}

/**
 * 显示系统dialog error
 * 
 * @param message
 *            显示信息
 */
function showError(message, callback) {
    system_dialog.show({
        level : "error",
        content : message,
        confirmCall : callback
    });
}

/**
 * 显示系统dialog alert
 * 
 * @param message
 *            显示信息
 */
function showAlert(message, callback) {
    system_dialog.show({
        level : "info",
        content : message,
        confirmCall : callback,
        needCancelBtn : false
    });
}

/**
 * 显示系统dialog confirm
 * 
 * @param message
 *            显示信息
 * @param callback
 *            确认回调函数
 */
function showConfirm(message, callback, cancelCallback) {
    system_dialog.show({
        level : "info",
        content : message,
        cancelCall : cancelCallback,
        confirmCall : callback
    });
}

/**
 * 隐藏或者显示iframe的内容
 */
function showOrHideIframe() {
    if (isFromIframe()) {
        $("[data-iframe]").each(function() {
            if ($(this).attr("data-iframe") == "true" && parent == top) {
                $(this).show();
            }
        });
        if (!$("body").hasClass("bg-grey"))
            $("body").css("padding-top", "0px");
        $("[data-iframe-css]").each(function() {
            if ($(this).attr("data-iframe-css") == "main") {
                $(this).attr("style", "padding:10px 15px 0px 15px !important");
            }
            if (parent != top) {
                $(this).attr("style", "padding:10px 0px 0px 15px !important");
            }
        });
    } else {
        $("[data-iframe]").each(function() {
            if ($(this).attr("data-iframe") == "false") {
                $(this).show();
            }
        });
    }

    $("[data-inner-iframe]").each(function() {
        if (parent != top) {
            $(this).attr("class", "");
            $("#patient-navbar").hide();
        }
    });
    if (parent != top) {
        $("#patientHeadNav").attr("style", "padding:0px 0px 0px 15px");
    }
}

/** 获取请求不包含后缀的相对路径 */
function getRelativeUrl(url) {
    if (isEmpty(url) || url.indexOf(".shtml") == -1) {
        return url;
    }
    var realUrl = "";
    var tempUrls = url.substring(url.indexOf(ctx) + ctx.length + 1, url.indexOf(".shtml")).split("/");
    for (var i = 0; i < tempUrls.length; i++) {
        if (!isEmpty(tempUrls[i]))
            realUrl += tempUrls[i] + "/";
    }
    if (realUrl.length > 0) {
        realUrl = realUrl.substring(0, realUrl.length - 1);
    }
    return realUrl;
}

/**
 * 禁用链接（userLink为a标签自定义属性）
 */
function disableLink() {
    $("[data-userLink]").each(function(index, obj) {
        $(this).attr("href", "#");
        $(this).css("cursor", "default");
        $(this).click(function() {
            return false;
        });
    });
}

var _storedPendingRequests = new Object();

/**
 * 所有ajax请求的通用前置filter
 * 
 * 1.统一处理错误异常 2.防止重复提交。两种方案，一根据状态位控制；二通过显示遮罩层控制。使用是，添加数据loading: true
 */
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    // 不重复发送相同请求
    var exists = false;
    for ( var i in _storedPendingRequests) {
        if (_storedPendingRequests[i].url == options.url && _storedPendingRequests[i].data == options.data) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        var pendingKey = "ajax_" + new Date().getTime();
        _storedPendingRequests[pendingKey] = {
            url : options.url,
            data : options.data
        };
        jqXHR.pendingKey = pendingKey;
    } else {
        // or do other
        jqXHR.abort();// 终止请求
    }

    options.loading = isEmpty(options.loading) ? true : options.loading;
    options.loadingMsg = options.loadingMsg || "正在加载中...";

    var beforeSend = options.beforeSend;
    options.beforeSend = function(jqXHR, settings) {
        if (options.loading) {
            // 提交前回调方法,动态创建loadDiv
            var loadingDiv = $("#loading_other").clone();
            $(loadingDiv).find("#loadingMsg").text(options.loadingMsg);
            $(loadingDiv).attr("id", jqXHR.pendingKey);
            $(loadingDiv).show();
            $("body").append(loadingDiv);
        }
        if ($.isFunction(beforeSend)) {
            beforeSend.apply(this, arguments);
        }
    };

    var success = options.success;
    options.success = function(data, textStatus, jqXHR) {
        if ($.isFunction(success)) {
            success.apply(this, arguments);
        }
    };

    var errorMsgArr = {
        401 : "登陆信息已过期,请重新登陆",
        404 : "404:很抱歉,您访问地址出错了...",
        403 : "403:很抱歉,您没有访问权限...",
        408 : "408:请求超时,请稍后重试...",
        500 : "500:很抱歉,服务器出错了..."
    };
    var error = options.error;
    options.error = function(jqXHR, textStatus, errorThrown) {
        var status = jqXHR.status;
        var msg = errorMsgArr[status];
        if (!isEmpty(msg))
            funNotice(msg, "error", 1000);
        if (status == 401) {
            top.location.href = ctx + "/logout.shtml";
            // top.location.reload(true);
        }
        if ($.isFunction(error)) {
            error.apply(this, arguments);
        }
    };

    var complete = options.complete;
    options.complete = function(jqXHR, textStatus) {
        if (options.loading) {
            // 请求完成后回调函数 (请求成功或失败之后均调用)。
            $("#" + jqXHR.pendingKey).remove();
        }
        // clear from pending requests
        delete _storedPendingRequests[jqXHR.pendingKey];
        delete jqXHR.pendingKey;
        if ($.isFunction(complete)) {
            complete.apply(this, arguments);
        }
    };
});

// 备份jquery的ajax方法
var qrCodeDomId;
var DIALYSIS_CONFIRM_PAGE = "confirmDialog";

function setQRCodeDomId(id) {
    qrCodeDomId = id;
}

function qrcode(qr) {
    $("#" + qrCodeDomId).val(qr);

    if (qrCodeDomId.indexOf(DIALYSIS_CONFIRM_PAGE) >= 0) {
        qrcode_callback(qrCodeDomId);
    }
}

/**
 * 透析机读取参数取整
 * 
 * @param json
 */
function roundMachineValue(json) {
    for (var i = 0; i < json.length; i++) {
        item = json[i];
        // 超滤量、超滤率、血流量、静脉压、跨膜压、透析液流量、收缩压、舒张压、脉搏（心率），值取整（透析液温度、透析液电导度除外）。
        if (item.name == "UF removed" || item.name == "UF rate" || item.name == "Blood pump flow rate" || item.name == "Venous pressure"
                        || item.name == "TMP" || item.name == "Dialysate flow rate" || item.name == "Systolic blood pressure"
                        || item.name == "Diastolic blood pressure" || item.name == "Pulse") {
            item.value = Math.round(parseFloat(item.value));
        }
    }
}

/** 提示信息 */
function showTips(msg, delay) {
    msg = isEmpty(msg) ? "保存成功" : msg;
    delay = isEmpty(delay) ? 2000 : delay;
    funNotice(msg, "text", delay);
}
/** 获取包含error的组件 */
function getValidateErrorDisplayEl(obj, index) {
    if (isEmpty(obj) || obj.length == 0) {
        return obj;
    }
    index = isEmpty(index) ? 0 : (++index);
    if (index == 20) {
        return obj;
    }
    if (obj.find("[data-error]").length > 0) {
        return obj;
    } else {
        return getValidateErrorDisplayEl(obj.parent(), index);
    }
}