/**
 * 导航栏切换事件注册
 */
$(document).ready(function() {
    // 添加公共事件
    addCommonEvents();
    // 隐藏或显示iframe的内容
    showOrHideIframe();

});

function addCommonEvents() {
    // textarea 自动伸缩事件
    $("textarea.textarea-auto-height").each(function() {
        addTextareaAutoHeightEvent(this);
    });

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
                }
            } else {
                location.reload(true);
            }
        }
    };

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
        // confirm warn info
        type = 'warn';
    }
    if (!isEmptyObject(errorMap)) {
        var json = {
            messages : errorMap,
            type : type
        };
        SystemDialog.set(json);
        SystemDialog.modal('show');
        SystemDialog.callback(function() {
            SystemDialog.modal("hide");
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
    var needCallback = isEmpty(callback) ? false : true;
    var map = {
        "" : message
    };
    var json = {
        messages : map,
        type : "info",
        cancelable : needCallback
    };
    SystemDialog.set(json);
    SystemDialog.modal('show');
    if (needCallback) {
        SystemDialog.callback(callback);
    } else {
        SystemDialog.callback(function() {
            SystemDialog.modal("hide");
        });
    }
}

/**
 * 显示系统dialog error
 * 
 * @param message
 *            显示信息
 */
function showError(message, callback) {
    var needCallback = isEmpty(callback) ? false : true;
    var map = {
        "" : message
    };
    var json = {
        messages : map,
        type : "warn",
        cancelable : needCallback
    };
    SystemDialog.set(json);
    SystemDialog.modal('show');
    if (needCallback) {
        SystemDialog.callback(callback);
    } else {
        SystemDialog.callback(function() {
            SystemDialog.modal("hide");
        });
    }
}

/**
 * 显示系统dialog alert
 * 
 * @param message
 *            显示信息
 */
function showAlert(message, callback) {
    var map = {
        "" : message
    };
    var json = {
        messages : map,
        type : "confirm"
    };
    SystemDialog.set(json);
    SystemDialog.modal('show');
    SystemDialog.callback(function() {
        SystemDialog.modal("hide");
        if (callback) {
            callback();
        }
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
function showConfirm(message, callback) {
    var map = {
        "" : message
    };
    var json = {
        messages : map,
        cancelable : true,
        type : "confirm"
    };
    SystemDialog.set(json);
    SystemDialog.modal('show');
    SystemDialog.callback(callback);
}
/**
 * 显示系统dialog confirm
 * 
 * @param message
 *            显示信息
 * @param callback
 *            确认回调函数
 * @param cancelCallback
 *            取消回调函数
 */
function showConfirm(message, callback, cancelCallback) {
    var map = {
        "" : message
    };
    var json = {
        messages : map,
        cancelable : true,
        type : "confirm"
    };
    SystemDialog.set(json);
    SystemDialog.modal('show');
    SystemDialog.callback(callback);
    if (!isEmpty(cancelCallback)) {
        SystemDialog.cancelCallback(cancelCallback);
    }
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

    options.loading = options.loading || false;
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
            showTips(msg, 1000);
        if (status == 401) {
            top.location.reload(true);
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

/** 提示信息 */
function showTips(msg, delay, callback) {
    if ($("#save-msg-tips").length == 0) {
        $("body").append('<div class="toast" id="save-msg-tips" style="z-index:99999;"><p></p></div>');
    }

    if (isEmpty(msg))
        msg = "保存成功";

    $("#save-msg-tips p").text(msg);
    $("#save-msg-tips").show();

    if (isEmpty(delay)) {
        delay = 2000;
    }
    $("#save-msg-tips").fadeIn("slow", function() {
        setTimeout(function() {
            $("#save-msg-tips").hide();
            if (callback)
                callback();
        }, delay);
    });
}
