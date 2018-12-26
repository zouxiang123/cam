<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.xtt.common.util.ContextAuthUtil"%>
<%@ page import="com.xtt.common.constants.CommonConstants"%>
<%@ page import="com.xtt.common.constants.CmSysParamConsts"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<%	
	Map<String, Object> authMap = ContextAuthUtil.getAuth();
	if(authMap != null){
		request.setAttribute(CommonConstants.LOGIN_USER, authMap.get(CommonConstants.LOGIN_USER));
		request.setAttribute(CommonConstants.USER_PERMISSION, authMap.get(CommonConstants.USER_PERMISSION));
		request.setAttribute(CommonConstants.USER_NON_PERMISSION, authMap.get(CommonConstants.USER_NON_PERMISSION));
	}
%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta content="telephone=no,email=no" name="format-detection" />
<meta name="viewport" content="width=1280, user-scalable=no, target-densitydpi=device-dpi">

<link rel="bookmark" href="${ctx }/assets/img/logo_ico.png">
<link rel="icon" href="${ctx }/assets/img/logo_ico.png">

<!-- Custom styles -->
<link rel="stylesheet" type="text/css" href="${ctx }/framework/layui/css/layui.css">
<link rel="stylesheet" type="text/css" href="${ctx }/assets/css/standard/css/public.css?version=${version}">
<link rel="stylesheet" type="text/css" href="${ctx }/assets/css/standard/css/private.css?version=${version}">
<!-- framework JavaScript -->
<script src="${ctx }/framework/jquery/1.11.3/jquery.min.js"></script>
<script src="${ctx }/framework/jquery/1.11.3/jquery.json.min.js"></script>
<script src="${ctx }/framework/jquery/1.11.3/jquery.validate.min.js"></script>
<script src="${ctx }/assets/js/common/ie10-viewport-bug-workaround.js"></script>
<!-- Custom JavaScript -->
<script src="${ctx }/assets/js/common/common-util.js?version=${version}"></script>
<!--[if lte IE 9 ]>
	<script src="${ctx }/framework/json2/json2.min.js"></script>
<![endif]-->
<!-- loading div -->
<div class="u-pageLoad" id="loading_center" style="display: none;">
    <div>
        <i class="icon-load"></i>
        <p>正在加载中......</p>
    </div>
</div>
<div class="u-pageLoad" id="loading_other" style="display: none;">
    <div>
        <i class="icon-load"></i>
        <p id="loadingMsg"></p>
    </div>
</div>

<script>
    console.time("mainPageRendering");
    if (typeof (loadingShow) == "undefined") {
        $("#loading_center").show();
    }
</script>

<script type="text/javascript">
    var ctx = "${ctx}";
    var loginUserId = "${login_user.id}";
    $(function() {
        $("#topSearchName").bind("keydown", function(e) {
            e = e || event;
            if (e.keyCode == 13 && $("#topSearchName").val() != "") {
                window.location.target = "frameBody";
                $("#frameBody").attr("src", ctx + "/search.shtml?name=" + encodeURI($("#topSearchName").val()));
            }
        });
    });
    //loading
    var loading_start_time = new Date().getTime();
    $(window).load(function() {
        var loading_time = new Date().getTime() - loading_start_time;
        if (loading_time < 400) {
            setTimeout(function() {
                $("#loading_center").animate({
                    opacity : 0
                }, {
                    duration : 200,
                    done : function() {
                        $("#loading_center").hide();
                    }
                });
            }, 400 - loading_time);
        } else {
            $("#loading_center").animate({
                opacity : 0
            }, {
                duration : 200,
                done : function() {
                    $("#loading_center").hide();
                }
            });
        }
        console.timeEnd("mainPageRendering");
    });
    var isPC = true;
</script>
<script src="${ctx }/framework/layui/layui.js?version=${version}"></script>
<script src="${ctx }/assets/js/common/permission.js?version=${version}"></script>
<script src="${ctx }/assets/js/common/common-standard.js?version=${version}"></script>
<script src="${ctx }/assets/js/common/common-validate.js"></script>
<script src="${ctx }/assets/js/common/common-validate-message-cn.js"></script>
<script src="${ctx }/assets/js/common/go-back.js?version=${version}"></script>
<script src="${ctx }/assets/css/standard/js/front.js"></script>
<script src="${ctx }/assets/js/common/system_dialog_standard.js?version=${version}"></script>
