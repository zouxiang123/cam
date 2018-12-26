$(function() {
    login.init();
});
var login = {
    init : function() {
        // 设置背景图片大小并将其铺满整个屏幕
        $(".loginbg").css({
            "width" : $(window).width(),
            "height" : $(window).height()
        });
        this.addEvents();

        if (window.top != window.self) {
            top.location.href = top.location.href;
        }

        if ($.cookie('savePwd') == "true") {
            $("#account").val($.cookie('account'));
            if (isEmpty($("#password").val())) {
                $("#password").val($.cookie('password'));
            }
            $("#savePassword").attr("checked", true);
        } else {
            $("#savePassword").attr("checked", false);
        }
        if (!isEmpty($("#errmsgDiv").text())) {// 存在错误提示
            return false;
        }
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $('input').on('click', function(e) {
            e.stopPropagation();
            if (threeTerminal() == "ipad") {
                if (window.screen.width == 931) {
                    $("#savePassword").css("top", "-10%");
                } else if (window.screen.width == 768) {
                    $(window).scrollTop(190);
                } else if (window.screen.width == 1280) {
                    $("#savePassword").css("top", "13%");
                }
            }
        });

        $("body").click(function() {
            if (threeTerminal() == "ipad") {
                $("#savePassword").css("top", "24%");
            }
        });
        // 账号和密码框聚焦事件，清空error的值
        $("#account,#password").on("change", function() {
            $("#errmsgDiv").empty();
        });
        // 关闭关于我们事件,显示登录框
        $("#closeAboutUs").click(function() {
            $("#login").removeClass("hide");
        });
    },
    validate : function() {
        if (isEmpty($("#account").val()) || isEmpty($("#password").val())) {
            $("#errmsgDiv").text("账号和密码不能为空！");
            return false;
        }
        var cookieItem = {
            "account" : $("#account").val(),
            'password' : $("#password").val(),
            'tenantId' : $("#tenantId").val(),
            'savePwd' : $("#savePassword").is(":checked")
        };
        if ($("#savePassword").is(":checked")) {
            for ( var key in cookieItem) {
                $.cookie(key, cookieItem[key], {
                    expires : 10,
                    path : '/'
                });
            }
        } else {
            for ( var key in cookieItem) {
                $.removeCookie(key, {
                    path : '/'
                });
            }
        }
        console.log($("#loginForm").serialize());
        return true;
    },
    /**
     * 隐藏登录输入框。弹出关于我们
     */
    aboutUs : function() {
        $("#login").addClass("hide");
        $("#aboutUsDialog").removeAttr("data-hide");
        showAboutUs();
    }
};