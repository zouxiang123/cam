<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head_standard.jsp"%>
<title>账号设置</title>
<div style="margin-left: 27px;">
<div class="login-account">
    <!-- 基本信息 start -->
    <div class="border-gray">
        <div style="background-image: url(${ctx  }assets/css/standard/img/accountBackground.png); background-size: 100%; height: 108px">
            <div id="imgdiv" class="u-display-inlineBlock u-float-l">
                <img src="${ctx  }/images${user.imagePath}" id="imgShow" onclick="jQuery('#up_img').click()" class="m-20 bg-white login-accountsetting-img">
                <form action="${ctx }/common/uploadImage.shtml?type=u" enctype="multipart/form-data" onsubmit="return uploadImg(this);"
                    method="post" id="imageUploadForm">
                    <input type="file" class="user-photo-uploader" id="up_img" name="image" style="display: none;" accept="image/*" />
                </form>
            </div>
            <input type="hidden" name="id" id="userId" value="${user.id }" />
            <div class="u-display-inlineBlock u-float-l mt-30">
                <span class="fs-22 fc-white">${user.name }</span>
                <div class="mt-10">
                    <span class="fc-white-7 mr-26"> ${user.birthdayShow } </span>
                    <span class="fc-white-7" style="margin-left: -24px;">${user.sexShow }</span>
                </div>
            </div>
        </div>
        <div class="ml-20 mr-20 mt-20">
            <span>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：${user.positionShow }</span> 
            <button text class="u-btn-blue u-float-r" id="modifyBasic">修改</button>
        </div>
        <form id="basicForm" onsubmit="return false;">
            <div class="ml-20 mr-20 mt-20">
                <span>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</span> 
                <input type="text" class="width-280 line-height-30 border-none-imp" data-target="basic" name="mobile" value="${user.mobile }" readonly/>
            </div>
            <div class="m-20" style="margin-top: 12px;">
                <span>联系方式：</span> 
                <input type="text" class="width-280 line-height-30 border-none-imp" data-target="basic" name="subPhone" value="${user.subPhone }" maxlength="64" readonly/>
            </div>
            <div class="m-20 mt-12" data-error></div>
        </form>
    </div>
    <!-- 基本信息 end -->
    <!-- 修改密码 start -->
    <div class="border-gray mt-12">
        <div class="ml-20 mr-20 mt-14 pb-14">
            <span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</span>
            <button text class="u-btn-blue u-float-r" id="update_password">修改</button>
        </div>
        <div class="ml-20 mr-20 mb-16 hide" id="changePasswordDiv">
          <form id="passwordForm" onsubmit="return false;">
            <div class="mt-12">
                <span>原&nbsp;&nbsp;密&nbsp;&nbsp;码：</span> 
                <input type="password" name="password" maxlength="128">
            </div>
            <div class="mt-12">
                <span>新&nbsp;&nbsp;密&nbsp;&nbsp;码：</span> 
                <input type="password" name="newPassword" id="newPassword" maxlength="128">
            </div>
            <div class="mt-12">
                <span>确认密码<span style="margin-left: 3px; margin-right: 1px">：</span></span> 
                <input type="password" class="personal-input" name="newPasswordConfirm" id="newPasswordConfirm" maxlength="128">
            </div>
            <div class="mt-12" data-error></div>
          </form>
        </div>
    </div>
    <!-- 修改密码 end -->
    <div class="bt-line pt-10 modelbottom">
        <button type="button" onclick="account_settings.save()" class="u-btn-blue mb-10 w-92" fill>保存</button>
    </div>
</div>
<script src="${ctx }/framework/jquery/1.11.3/jquery.form.js"></script>
<script src="${ctx }/framework/uploadPreview.min.js?version=${version}"></script>
<script src="${ctx }/assets/js/cm/conf/account_settings.js?version=${version}"></script>
</body>
</html>