<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<div class="u-mask" id="iframeDialog" data-hide="#iframeDialog">
    <div class="u-dialog">
        <div class="u-dialog-header">
            <div class="pl-12 fw-bold" data-title1></div>
            <div class="fs-18" data-title></div>
            <div class="u-float-r">
                <i class="icon-close" data-hide="#iframeDialog"></i>
            </div>
        </div>
        <div class="u-dialog-content" style="padding-bottom: 5px;">
            <div id="iframeDialogContentDiv"></div>
        </div>
        <div class="u-dialog-footer text-center">
            <button type="button" data-btn="cancel">取消</button>
            <button type="button" class="u-btn-blue" data-btn="save" fill>保存</button>
        </div>
    </div>
</div>
<script type="text/javascript">
    /**
     * 显示全屏dialog
     * 
     * @param param {
     * title:标题, title1:小标题, 
     * saveCall：保存事件回调（返回iframe窗口）,
     * url:请求地址,
     * cancelCall:取消回调,
     * fullScreen 是否全屏弹框(默认全屏),
     * tabs: [title,url,hidebtn(0 不隐藏,1 隐藏)] 多个url}
     */
    function showIframeDialog(param) {
        var dialog = $("#iframeDialog");
        param.fullScreen = isEmpty(param.fullScreen) ? true : param.fullScreen;//默认为全屏弹框
        dialog.find(".u-dialog").attr("style", "");//清空动态生成的样式
        if (param.fullScreen) {//兼容全屏和非全屏
            dialog.find(".u-dialog").attr("fullScreen", "");
        } else {
            dialog.find(".u-dialog").removeAttr("fullScreen");
        }
        dialog.find("[data-title1]").text(convertEmpty(param.title1));
        // 清空样式
        dialog.find("[data-title]").removeClass().empty();
        //清空iframe 内容
        cleanIframeDialogContent();
        dialog.find("[data-btn]").off("click").on("click", function() {//按钮确定和取消事件
            var iframe = $("#iframeDialog").find("iframe")[0];
            var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
            if ($(this).data("btn") == "cancel") {
                if (!isEmpty(param.cancelCall)) {
                    param.cancelCall(iframeWin);
                } else {
                    hiddenMe("#iframeDialog");
                }
            } else if ($(this).data("btn") == "save") {
                if (!isEmpty(param.saveCall)) {
                    param.saveCall(iframeWin);
                } else {
                    hiddenMe($("#iframeDialog"));
                }
            }
        });
        if (!isEmptyObject(param.tabs)) {
            var length = param.tabs.length;
            var left = length > 2 ? 19 : 38;
            var tabEl = $('<div class="u-clearfix mt-6 tab-indextitle" style="width:' + length * 120 + 'px;left:' + left + '%"></div>');
            for (var i = 0; i < length; i++) {
                var tab = param.tabs[i];
                tab.hidebtn = tab.hidebtn || 0;
                tabEl.append('<span class="tab-index-item ' + (i == length - 1 ? "last-item" : "") + '" data-url="' + tab.url + '" data-hidebtn="'
                                + tab.hidebtn + '">' + tab.title + '</span>');
            }
            dialog.find("[data-title]").append(tabEl);
            dialog.find("[data-title]").off("click").on("click", ".tab-index-item", function() {
                $(this).addClass("active").siblings().removeClass("active");
                cleanIframeDialogContent();
                createIframeDialogIframe($(this).data("url"));
                if ($(this).data("hidebtn") == "1") {
                    $("#iframeDialog").find(".u-dialog-footer").addClass("hide");
                } else {
                    $("#iframeDialog").find(".u-dialog-footer").removeClass("hide");
                }
            });
            popDialog(dialog, function() {
                //设置iframe显示区域高度，默认280
                var maxHeight = 280;
                if (param.fullScreen) {//全屏弹框时，取内容区域最大高度
                    maxHeight = parseInt(dialog.find(".u-dialog-content").css("max-height").replace("px", "")) - 18;
                }
                $("#iframeDialogContentDiv").height(maxHeight);
                dialog.find(".tab-index-item:first").click();
            });
        } else {
            dialog.find("[data-title]").addClass("fs-18");
            dialog.find(".u-dialog-footer").removeClass("hide");
            dialog.find("[data-title]").text(convertEmpty(param.title));
            popDialog(dialog, function() {
                //设置iframe显示区域高度，默认280
                var maxHeight = 280;
                if (param.fullScreen) {//全屏弹框时，取内容区域最大高度
                    maxHeight = parseInt(dialog.find(".u-dialog-content").css("max-height").replace("px", "")) - 18;
                }
                $("#iframeDialogContentDiv").height(maxHeight);
                createIframeDialogIframe(convertEmpty(param.url));
            });
        }
    };

    function createIframeDialogIframe(url) {
        var iframe = $('<iframe style="position: absolute;top:12px;" frameborder="no" border="0" scrolling="yes" allowtransparency="yes"></iframe>');
        iframe.attr("src", url);
        iframe.height($("#iframeDialogContentDiv").height());
        iframe.css("width", "calc(100% - 24px)");
        $("#iframeDialogContentDiv").append(iframe);
    }

    function setIframeDialogHeight(height) {
        $("#iframeDialog").find("iframe").height(height);
        $("#iframeDialogContentDiv").height(height);
        popDialog("#iframeDialog");
    }

    function cleanIframeDialogContent() {
        $("#iframeDialogContentDiv").empty();
    }
</script>
