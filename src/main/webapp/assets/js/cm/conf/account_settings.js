$(function() {
    account_settings.init();
});
var account_settings = {
    modifyType : {
        basic : false,
        password : false
    },
    init : function() {
        this.addEvents();
        this.addValidate();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 头像上传
        new uploadPreview({
            UpBtn : "up_img",
            DivShow : "imgdiv",
            ImgShow : "imgShow"
        });
        // 图片上传事件
        $("#up_img").change(function() {
            account_settings.uploadImg($("#imageUploadForm"));
        });
        // 修改基础信息
        $("#modifyBasic").on("click", function() {
            if ($(this).html() == "修改") {
                account_settings.modifyType.basic = true;
                $(this).html("取消");
                $("[data-target='basic']").attr("readonly", false).removeClass("border-none-imp");
            } else if ($(this).html() == "取消") {
                account_settings.modifyType.basic = false;
                $(this).html("修改");
                $("[data-target='basic']").attr("readonly", true).addClass("border-none-imp");
            }
        });
        // 修改密码
        $("#update_password").on("click", function() {
            if ($(this).html() == "修改") {
                account_settings.modifyType.password = true;
                $(this).html("取消");
                $(this).parent().addClass("bb-dashed");
                $('#passwordForm')[0].reset();
                $("#changePasswordDiv").removeClass("hide");
            } else if ($(this).html() == "取消") {
                account_settings.modifyType.password = false;
                $(this).html("修改");
                $(this).parent().removeClass("bb-dashed");
                $("#changePasswordDiv").addClass("hide");
            }
        });
    },
    /**
     * 上传图片
     * 
     * @param formId
     */
    uploadImg : function(form) {
        if (isEmpty($("#up_img").val())) {
            showWarn("请选择上传的文件");
            return false;
        }
        var options = {
            dataType : "json",
            url : ctx + "/system/uploadImage.shtml",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    $("#nav-user-photo").attr("src", convertURL(ctx + "/images" + data.filepath));
                    $(form)[0].reset();
                    showTips("头像上传成功");
                    return false;
                } else if (data.status == 2) {
                    showWarn("请选择上传的文件");
                    return false;
                }
            }
        };
        $(form).ajaxSubmit(options);
        return false;
    },
    save : function() {
        if (this.modifyType.basic) {
            if ($('#basicForm').valid()) {
                var formData = "id=" + $("#userId").val();
                formData += "&" + $('#basicForm').serialize();
                $.ajax({
                    url : ctx + "/system/updateUser.shtml",
                    data : formData,
                    type : "post",
                    dataType : "json",
                    async : false,
                    success : function(data) {
                        if (data.status == "1") {
                            $("#modifyBasic").click();
                            showTips();
                        }
                    }
                });
            }
        }
        if (this.modifyType.password) {
            if (this.validPassword()) {
                $.ajax({
                    url : ctx + "/system/changePassword.shtml",
                    data : $('#passwordForm').serialize(),
                    type : "post",
                    dataType : "json",
                    async : false,
                    success : function(data) {
                        if (data.status == 1) {
                            $("#update_password").click();
                            showTips("修改密码成功");
                        } else if (data.status == 2) {
                            showWarn("原密码不正确");
                        }
                    }
                });
            }
        }
    },
    addValidate : function() {
        $.validator.addMethod("isMobile", function(value, element, params) {
            if (isEmpty(value)) {
                return true;
            }
            var pattern = /^1[34578]\d{9}$/;
            return pattern.test(value);
        }, jQuery.validator.format("请输入正确的手机号！"));
        $('#basicForm').validate({
            // 校验字段
            rules : {
                mobile : {
                    isMobile : true
                },
                subPhone : {
                    customMaxlength : [ 64, "联系方式" ]
                }
            },
            messages : {
                subPhone : {
                    customMaxlength : "联系方式长度不能超过64位"
                }
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorDisplayEl($(element));
                $(error).css("display", "block");
                obj.find("[data-error]").append(error);
            }
        });
    },
    /**
     * 校验密码
     */
    validPassword : function() {
        var old = $.trim($("input[name='password']").val());
        var new1 = $.trim($("input[name='newPassword']").val());
        var new2 = $.trim($("input[name='newPasswordConfirm']").val());
        if (isEmpty(old)) {
            showWarn("请输入原密码！");
            return false;
        }
        if (isEmpty(new1)) {
            showWarn("请输入新密码！");
            return false;
        }
        if (isEmpty(new2)) {
            showWarn("确认密码不能为空！");
            return false;
        }
        if (new1 == old) {
            showWarn("新密码不能和原密码一样");
            return false;
        }
        if (new1 != new2) {
            showWarn("新密码和确认密码必须一样！");
            return false;
        }
        return true;
    }
};