<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>

<!--关于我们-->
<div class="u-mask" id="aboutUsDialog" data-hide="#aboutUsDialog">
    <div class="u-dialog">
        <div class="u-dialog-content" style="padding: 0px; height: 400px;">
            <div class="text-center position-relative"
                style="height: 190px;background-image: url(${ctx }/assets/css/standard/img/aboutUs.png);background-size:100%;">
                <div class="u-display-inlineBlock position-absolute cursor-pointer login-close">
                    <span class="icon-round position-absolute fc-48-5 login-icon-round"></span> 
                    <span class="fs-20 fc-white position-absolute login-icon-close" data-hide="#aboutUsDialog" id="closeAboutUs">×</span>
                </div>
                <img src="${ctx }/assets/css/standard/img/xttLoginLogo.png" alt="" class="mt-30 loginLoginLogo">
                <div class="fs-26 fc-white loginVersionTitel">XTT-血液透析智能系统</div>
            </div>
            <div>
                <div class="u-display-inlineBlock text-center u-xt-5 mt-40">
                    <img src="${ctx }/assets/css/standard/img/xttwxQCcode.jpg" alt="" style="width: 120px; height: 120px">
                    <div class="fc-48-5 mt-10">微信扫一扫</div>
                </div>
                <div class="u-display-inlineBlock u-xt-7 mt-40">
                    <div class="fw-bold fs-22">版本：${version}</div>
                    <div class="fc-48-5 mt-26">客服：400-021-9859</div>
                    <div class="fc-48-5 mt-14">邮箱：xtt@xuetoutong.com</div>
                    <div class="fc-48-5 mt-14">地址：上海市静安区林顿大夏23、24楼</div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
/**
 * 显示关于我们
 */
 function showAboutUs(callback){
     popDialog("#aboutUsDialog",function(){
         if(!isEmpty(callback)){
             callback(); 
         }
     });
 }
</script>