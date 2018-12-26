var tab_nav = {
    style : null,
    init : function(style) {
        if (!isEmpty(style)) {
            this.style = style;
        }
        tab_nav.setHeight();
        tab_nav.addEvents();
        $("#tabsDiv [data-url]:first").trigger("click");
        if (this.style == "standard") {
            dynamicMenu();
        }
    },
    setHeight : function() {
        var offset = $("#tabsBodyDiv").offset();
        $("#basicIframeDiv").find("iframe").css({
            position : "fixed",
            top : offset.top,
            left : offset.left,
            height : $(window).height() - offset.top,
            width : $(window).width() - offset.left
        });
    },
    addEvents : function() {
        $("#tabsDiv").on("click", "[data-url]", function(event) {
            var bodyId = $(this).data("target");
            $(this).addClass("active").siblings().removeClass("active");
            if ($("#" + bodyId).length > 0) {
                var refresh = $(this).data("refresh");
                if (refresh == "1") {
                    var iframe = $("#" + bodyId).find("iframe")[0];
                    iframe.contentDocument.body.innerHTML = "";
                    iframe.src = $(this).data("url");
                    $("#" + bodyId).removeClass("hide");
                } else {
                    $("#" + bodyId).removeClass("hide");
                }
            } else {
                tab_nav.addIframe(bodyId, $(this).data("url"));
            }
            $("#" + bodyId).siblings().addClass("hide");
            // trigger define event
            $("#tabsDiv").trigger("tab_nav.click", [ $(this) ]);
        });
        $(window).on("resize", function() {
            var height = $(window).height() - ($("#tabsBodyDiv").offset().top + 10);
            $("iframe").height(height);
        });
    },
    /**
     * 添加tab { id : 唯一tab id, name : "tab 名称", url : '打开页面url', refresh : "是否需要刷新", removeCall : "关闭tab时，激活页面执行的回调函数名称" }
     * 
     * @param param
     * @returns {Boolean}
     */
    addTab : function(param) {
        var p = {
            id : new Date().getTime(),
            name : "new tab",
            url : null,
            refresh : "1",
            removeCall : null
        };
        $.extend(p, param);
        if ($("#tabsDiv [data-target='" + p.id + "']").length > 0) { // 已经存在，不添加新窗口
            $("#tabsDiv [data-target='" + p.id + "']").click();
            return false;
        }
        if (isEmpty(p.url)) {
            showWarn("添加的tab页url不能为空");
            return false;
        }
        if ($("#tabsDiv [data-url]").length > 10) {
            showWarn("您打开的页面过多");
            return false;
        }
        var tabHtml = "";
        var dataStr = 'data-url="' + p.url + '" data-refresh="' + p.refresh + '" data-target="' + p.id + '"';
        if (isEmpty(this.style)) { // 使用默认样式
            tabHtml = '<span class="u-tab hand" ' + dataStr + '>' + p.name
                            + '<span class="u-tab-delete" onclick = "tab_nav.closeTab(event,this);"></span></span>';
        } else if (this.style == "btn-grey") { // 灰色按钮
            tabHtml = '<span class="u-btn-close-1" ' + dataStr + '>' + p.name
                            + '<span class="u-tab-delete mt-2" onclick = "tab_nav.closeTab(event,this);"></span></button>';
        } else if (this.style == "standard") {
            tabHtml = '<span ' + dataStr + '><a href="javascript:void(0);">' + p.name
                            + '</a><i class="icon-close" onclick="tab_nav.closeTab(event,this);"></i></span>';
        }
        $("#tabsDiv").append(tabHtml);
        // 设置添加tab的来源id为当前激活的tabid
        var el = $("#tabsDiv [data-target='" + p.id + "']");
        el.data("fromId", $("#tabsDiv [data-url].active").data("target"));
        if (!isEmpty(p.removeCall)) {
            el.data("removeCall", p.removeCall);
        }
        // trigger define add event
        $("#tabsDiv").trigger("tab_nav.add", [ el ]);
        el.trigger("click");
        if (this.style == "standard") {
            dynamicMenu();
        }
    },
    addIframe : function(id, url) {
        var body = $("#basicIframeDiv").clone(true);
        $(body).removeClass("hide");
        $(body).attr("id", id);
        $(body).find("iframe").attr("src", url);
        $("#tabsBodyDiv").append(body);
    },
    closeTab : function(event, el) {
        tab_nav.removeActiveTab($(el).parent());
        stopEventBubble(event);
    },
    removeActiveTab : function(el) {
        if (isEmpty(el)) {
            el = $("#tabsDiv [data-url].active");
        }
        el = $(el);
        if (el.data("fixed") == "1") { // 如果当前tab是固定tab,不能移除
            return false;
        }
        var formId = el.data("fromId");
        var callFun = el.data("removeCall");
        // 删除iframe body
        $("#" + el.data("target")).remove();
        // trigger remove event
        $("#tabsDiv").trigger("tab_nav.remove", [ el ]);
        // 删除tab
        $(el).remove();
        // 没有来源id时，打开第一个,有来源id时，打开来源tab
        var clickEl = isEmpty(formId) ? $("#tabsDiv [data-url]:first") : $("#tabsDiv [data-target='" + formId + "']");
        clickEl.trigger("click");
        var bodyId = clickEl.data("target");
        if ($("#" + bodyId).length > 0) {
            var iframeWindow = $("#" + bodyId).find("iframe")[0].contentWindow;
            if (iframeWindow.existsFunction(callFun)) {
                iframeWindow.eval(callFun + "()");
            }
        }
        if (this.style == "standard") {
            dynamicMenu();
        }
    }
};
/**
 * 删除当前tab
 * 
 */
function removeActiveTab() {
    tab_nav.removeActiveTab();
}
/**
 * 添加tab { id : 唯一tab id, name : "tab 名称", url : '打开页面url', refresh : "是否需要刷新", removeCall : "关闭tab时，激活页面执行的回调函数名称" }
 */
function addTab(param) {
    tab_nav.addTab(param);
}