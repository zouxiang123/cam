<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<%@ include file="common/head_standard.jsp"%>
<script src="${ctx }/framework/jquery/1.11.3/jquery.cookie.js"></script>
<title>登录</title>
<style>
    @media screen and (max-width: 1300px) {
        .fs-28 {
            font-size: 22px;
        }

        .fs-18 {
            font-size: 14px;
        }

        .loginContent {
            width: 38%;
            left: 31%;
        }
    }

    @media screen and (width: 1280px) {
        .fs-28 {
            font-size: 22px;
        }

        .fs-18 {
            font-size: 14px;
        }

        .loginContent {
            width: 32%;
            left: 34%;
        }
    }

    input, input[type=text]:focus, input[type=password]:focus {
        border: none;
        box-shadow: none;
        padding: 0px;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
</style>
</head>
<body>
<div class="loginbg" style="background: url(${ctx }/images/ckd_login_bg.jpg) no-repeat 0px 0px;">
    <div class="bg-white line-height-48" style="box-shadow:  0px 2px 2px rgba(0,0,0,.2);">
        <img src="${ctx  }/images/ckd_login_logo.png" class="ml-10" style="height:36px;">
        <%-- <button type="button" text class="u-float-r ml-20 mr-18 line-height-48" onclick="location.href='${ctx  }/feedback.shtml?sysOwner=${sysOwner }'">意见反馈</button> --%>
        <button type="button" text class="u-float-r line-height-48 ml-20 mr-18"  onclick="login.aboutUs();">关于我们</button>
    </div>
    <div class="loginContent text-center" id="login">
        <div class="fs-28 fc-30" style="margin-top: 8%;">${tenantName }</div>
        <div class="fs-18 fc-30" style="margin-top: 3%;">学透通®慢病智能系统</div>
        <form action="${ctx }/login.shtml" onsubmit="return login.validate();" method="post" id="loginForm">
            <input type="hidden" name="isloginSubmit" value="true" /> 
            <input type="hidden" name="redirectUrl" value="${redirectUrl }" /> 
            <input type="hidden" id="tenantId" name="tenantId" value="${tenantId }" />
            <div class="login-container">
                <div class="bb-line fc-grey  w-100 text-left" style="margin-top: 10%;">
                    <input type="text" placeholder="账号" id="account" name="account" value="${account }" 
                        class="p-0-imp border-none-imp" style="-webkit-box-shadow: 0 0 2px 100px white inset;">
                </div>
                <div class="bb-line fc-grey w-100 text-left" style="margin-top: 5%;">
                    <input type="password" placeholder="密码" id="password" name="password" value="${password }" 
                        class="p-0-imp border-none-imp" style="-webkit-box-shadow: 0 0 2px 100px white inset;">
                </div>
                <div class="fc-red text-left" style="margin-top: 3%;" id="errmsgDiv">${errmsg}</div>
                <div class="text-left" style="margin-top: 3%;">
                    <label class="u-checkbox">
                        <input type="checkbox" name="savePassword"  id="savePassword">
                        <span class="icon-checkbox"></span>十天内免登录
                    </label>
                </div>
                <button type="submit" class="u-btn-blue height-44 fs-16 w-100" id="loginFormSubmit" fill style="margin-top: 3%;">登 录</button>
            </div>
         </form>
    </div>
    <div class="footer-info" >
        @学透通 版权所有
    </div>
</div>
<jsp:include page="common/about_us.jsp"></jsp:include>
</body>
<script type="text/javascript" src="${ctx }/assets/js/login.js?version=${version}""></script>
</html>
