var isExtend = true;
$(function() {
    if (window.top != window.self) {
        top.location = self.location;
    }
    resizeFrame();
    addEvents();
    $(".new-nav-item").eq(1).children("div").removeClass("nav-close").addClass("nav-open");
    $(".new-nav-item").eq(1).next().show();
    $(".new-nav-item").eq(1).click();
    // 回到顶部
    showScroll();
});

function showScroll() {
    if ($("#frameBody") == undefined)
        return;
    var iframe = document.getElementById('frameBody');
    var frameWin = iframe.contentWindow;
    iframe.onload = function() {
        $(".scroll-top").fadeOut();
        // iframe加载完成后你需要进行的操作，绑定滚动条事件
        $(frameWin).scroll(function() {
            var scrollValue = $(frameWin.document.body).scrollTop();
            if (scrollValue > 100) {
                $(".scroll-top").fadeIn()
            } else {
                $(".scroll-top").fadeOut()
            }
        });
    };
    $('#scroll-top').click(function() {
        var iframe = document.getElementById('frameBody');
        var frameWin = iframe.contentWindow;
        $(frameWin.document.body).animate({
            scrollTop : 0
        }, 200);
    });
}

function addEvents() {
    $(".new-nav-sub-item").mouseover(function() {
        var elements = $(this).find(".side-tip-show");
        if (elements.length > 0) {
            $("#sidebar-tip").data("parentElement", this);
            $("#sidebar-tip").html(elements.clone().html());
            if (isExtend) {
                $("#sidebar-tip").css("top", $(this).offset().top + "px");
                $("#sidebar-tip").css("left", $(this).offset().left + 187 + "px");
                $("#sidebar-tip").show();
            } else {
                $("#sidebar-tip").css("top", $(this).offset().top + "px");
                $("#sidebar-tip").css("left", $(this).offset().left + 47 + "px");
                $("#sidebar-tip").show();
            }
        } else {
            $("#sidebar-tip").hide();
            $("#sidebar-tip").empty();
        }
    });
    $("#sidebar-tip").mouseleave(function() {
        $(this).hide();
        $(this).empty();
    });

    $(".new-nav-item:not(#main-close)").click(function(e) {
        if ($(this).children("div").hasClass("nav-open")) {
            $(this).children("div").removeClass("nav-open").addClass("nav-close");
            $(this).next().hide();

            // 菜单收起时显示图标
            $("#menu_wdgzz").attr("src", ctx + "/assets/img/nav-txjgl.png");

        } else if ($(this).children("div").hasClass("nav-close")) {
            $(this).children("div").removeClass("nav-close").addClass("nav-open");
            $(this).next().show();

            // 菜单展开时显示图标
            $("#menu_wdgzz").attr("src", ctx + "/assets/img/nav-myworkstation.png");

        } else {
            $(".new-nav-sub-item").removeClass("active");
            $(".new-nav-item").removeClass("active");
            $(this).addClass("active");
        }
    });

    $("#sidebar-tip").on("click", ".side-tip-show-span", function() {
        $(".new-nav-sub-item,.new-nav-item").removeClass("active");
        $(".new-nav-sub-item").children("span").removeClass("active");
        $(this).addClass("active").siblings().removeClass("active");
        var parentObj = $($(this).parent().data("parentElement"));
        parentObj.addClass("active");
        parentObj.children("span").addClass("active");

    });

    $("#main-close").click(function() {
        isExtend = !isExtend;
        resizeFrame();
    });
    // 从权限中获取url
    $("[data-permissionurl]").click(function(event) {
        var key = $(this).attr("data-permission-key");
        var baseUrl = convertEmpty($(this).data("baseurl"));
        var openUrl = ctx + "/openUrl.shtml?baseUrl=" + encodeURIComponent(baseUrl) + "&key=" + encodeURIComponent(key);
        var param = $(this).data("param");
        if (!isEmpty(param)) {
            openUrl += '&param=' + encodeURIComponent(param);
        }
        $("#frameBody").attr("src", openUrl);
        stopEventBubble(event);
    });
    // 打开url
    $("[data-openurl]").click(function(event) {
        var openUrl = ctx + "/" + $(this).data("openurl");
        $("#frameBody").attr("src", openUrl);
        stopEventBubble(event);
    });
}

function resizeFrame() {
    if (isExtend) {
        $("#frameBody").css("left", 172);
        $("#frameBody").css("width", document.documentElement.clientWidth - 172);
    } else {
        $("#frameBody").css("left", 46);
        $("#frameBody").css("width", document.documentElement.clientWidth - 46);
    }
    $("#frameBody").css("height", document.documentElement.clientHeight);
}

function openBody(event, element, url) {
    url = $(element).data("baseurl") + "/" + url;
    $("#frameBody").attr("src", url);
    stopEventBubble(event);
}
$("#settingId li").click(function(e) {
    e.stopPropagation();
    $("#settingId").hide();
    return;
});

function logout() {
    var storage = window.sessionStorage;
    storage.removeItem("homeNotified");
    storage.removeItem("urlStack");
    window.location.href = ctx + "/logout.shtml";
}

function saveSkin() {
    var skin = $(".u-side-nav").attr("data-skin");
    $.ajax({
        url : ctx + "/system/saveSkin.shtml",
        data : "skin=" + skin,
        type : "post",
        dataType : "json",
        loading : true,
        success : function(data) { // ajax返回的数据
            if (data) {
                if (data.status == 1) {
                    showTips("保存成功！");
                    $(".u-skin-module").slideUp();
                }
            }
        }
    });
}