<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta name="description" content="">
<meta name="author" content="">
<link rel="bookmark" href="${ctx }/assets/img/logo_ico.png">
<link rel="icon" href="${ctx }/assets/img/logo_ico.png">

<!-- Bootstrap core CSS -->
<link href="${ctx }/framework/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">

<!-- Custom styles -->
<link href="${ctx }/assets/css/print.css" rel="stylesheet">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
<script src="${ctx }/framework/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="${ctx }/framework/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->

<!-- framework JavaScript -->
<script src="${ctx}/1framework/jquery/1.11.3/jquery.min.js"></script>
<!-- Custom JavaScript -->
<script src="${ctx}/assets/js/common-util.js?version=${version}"></script>
<!--移动端版本兼容 -->
<script type="text/javascript">
    var phoneWidth = parseInt(window.screen.width);
    var phoneScale = phoneWidth / 1240;

    var ua = navigator.userAgent;
    if (/Android (\d+\.\d+)/.test(ua)) {
        var version = parseFloat(RegExp.$1);
        // andriod 2.3
        if (version > 2.3) {
            document.write('<meta name="viewport" content="width=1240, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
            // andriod 2.3以上
        } else {
            document.write('<meta name="viewport" content="width=1240, target-densitydpi=device-dpi">');
        }
        // 其他系统
    } else {
        document.write('<meta name="viewport" content="width=1240, user-scalable=no, target-densitydpi=device-dpi">');
    }
    $("html").data("phpServerAddr","${phpServerAddr}");
</script>
<!--移动端版本兼容 end -->
<style type="text/css">
.print-btn {
   position: fixed;
   margin: 10px;
   width: 100px;
   height: 45px;
   font-size: 20px;
   right:0px;
}
.print-btn1 {
   position: fixed;
   margin: 10px;
   width: 100px;
   height: 45px;
   font-size: 20px;
   right:110px;
}
.print-btn2 {
   position: fixed;
   margin: 10px;
   width: 100px;
   height: 45px;
   font-size: 20px;
   right:220px;
}
</style>
