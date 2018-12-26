<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>用户管理</title>
<%@ include file="../../common/head_standard.jsp"%>
<style>
  *{
    color: #484848;
  }
  .u-table-fixed-body td{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .u-table-fixed-body td img{
    width:30px;
    height: 30px;
  }
  .u-list-text .left{
    width: 78px;
    text-align: left;
  }
  .u-list-text .right{
    width: calc(100% - 78px);
  }
</style>
</head>
<body>
  <div class="line-height-40 ml-12 mr-12 mt-12" id="searchRow">
    <input type="text" placeholder="账号/用户名/电话" id="search" style="width: 310px">
    <button type="button" class="u-float-r u-btn-blue mt-4" data-popup="#promptDialog" onclick="addUser()" fill>新增</button>
  </div>
  <div class="xtt ml-12 mr-12 mt-10">
   <div class="u-table-fixed">
    <div class="u-table-fixed-head">
      <table class="u-table u-table-bordered">
        <thead>
          <tr>
           <th class="xtt-5">头像</th>
           <th class="xtt-16">帐号</th>
           <th class="xtt-16">姓名</th>
           <th class="xtt-18">手机号码</th>
           <th>角色</th>
           <th class="xt-3">分机号</th>
           <th class="xtt-18">操作</th>
         </tr>
       </thead>
     </table>
   </div>
   <div class="u-table-fixed-body" id="table1">
    <table class="u-table u-table-bordered" style="table-layout: fixed;">
      <tbody id="tableBody"></tbody>
   </table>
 </div>
</div>
<!--弹框-->
    <div class="u-mask" id="promptDialog" data-hide="#promptDialog">
        <div class="u-dialog" style="width:650px;">
            <div class="u-dialog-header">
                <div></div>
                <div class="fs-18" id="title_show"></div>
                <div></div>
            </div>
            <form action="${ctx }/system/uploadImage.shtml" onsubmit="return uploadImg(this);" enctype="multipart/form-data" method="post" id ="imageUploadForm">
                <input type="file" id="up_img" name="image" style="display:none;" accept="image/*"/>
            </form>
            <form id="userInfoForm">
            <input type="hidden" name="id" id="id" value="" />
            <input type="hidden" name="imagePath" id="imagePath" value="" />
            <div class="u-dialog-content" style="padding: 20px 30px 0">
                <div class="u-xt-12">
                    <img id="imgShow" class="" src="${ctx}/assets/img/default-user.png">
                    <span class="fc-blue ml-22" onclick="$('#up_img').click();">设置头像</span>
                </div>
                <div class="u-xt-12">
                  <div class="u-xt-6">
                    <div class="u-list-text">
                      <div class="left">
                        <span>*账号：</span>
                      </div>
                      <div class="right">
                        <input type="text" style="width:150px" id="account" name="account" required="required" maxlength="32">
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text u-float-r" style="width:226px">
                      <div class="left">
                          <span>*姓名：</span>
                      </div>
                      <div class="right">
                          <input type="text" style="width:150px" name="name" required="required"  maxlength="32">
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text">
                      <div class="left">
                          <span>*性别：</span>
                      </div>
                      <div class="right">
                          <label class="u-radio">
                              <input type="radio" name="sex" value="M">
                              <span class="icon-radio"></span>男
                          </label>
                          <label class="u-radio">
                              <input type="radio" name="sex" value="F">
                              <span class="icon-radio"></span>女
                          </label>
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text u-float-r" style="width:226px">
                      <div class="left">
                          <span>*出生日期：</span>
                      </div>
                      <div class="right">
                          <input type="text" style="width:150px" name="birthdayShow" id="birthdayShow">
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text">
                      <div class="left">
                          <span>*手机号码：</span>
                      </div>
                      <div class="right">
                          <input type="text" style="width:150px" name="mobile">
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text u-float-r" style="width:226px">
                      <div class="left">
                          <span>分机号：</span>
                      </div>
                      <div class="right">
                          <input type="text" style="width:150px" name="subPhone" maxlength="64">
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-12 pt-4">
                    <div class="u-list-text">
                      <div class="left">
                          <span>擅长：</span>
                      </div>
                      <div class="right" style='height:96px'>
                          <textarea class="w-100-imp" style='height:96px' name="speciality"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-12 mt-8">
                    <div class="u-list-text">
                      <div class="left">
                          <span>简介：</span>
                      </div>
                      <div class="right">
                          <textarea class="w-100-imp" style='height:96px' name="summary"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-12">
                    <div class="u-list-text">
                      <div class="left">
                          <span>*角色：</span>
                      </div>
                      <div class="right">
                          <c:forEach var="role" items="${roleList }">
                                <label class="u-checkbox" >
                                  <input type="checkbox" id="roleIdChecbox${role.id}" name="roleId" value="${role.id}" parentId = "${role.parentId }">
                                  <span class="icon-checkbox"></span>${role.name }
                                </label>
                            </c:forEach>
                      </div>
                    </div>
                  </div>
                  <div class="u-xt-6">
                    <div class="u-list-text" style="width:226px">
                      <div class="left">
                          <span>*职称：</span>
                      </div>
                      <div class="right" id="position"></div>
                    </div>
                  </div>
                  <div class="u-xt-12">
                    <div class="u-list-text">
                      <div class="left">
                          <span>*所属系统：</span>
                      </div>
                      <div class="right">
                          <c:forEach var="item" items="${sys_owner }">
                                <label class="u-checkbox" >
                                  <input type="checkbox" id="sysOwnerCheckbox${item.itemCode}" name="sysOwner" value="${item.itemCode}">
                                  <span class="icon-checkbox"></span>${item.itemName}
                                </label>
                            </c:forEach>
                      </div>
                    </div>
                  </div>
                </div>


            </div>
            </form>
            <div class="u-dialog-footer" style="border-top: 1px solid #d9e0e6;">
                <button type="button" data-hide="#promptDialog">取消</button>
                <button type="button" class="u-btn-blue" onclick="updateUserInfo()" fill>确定</button>
            </div>
        </div>        
    </div>
    <!--弹框-->
    <div>
        <div id="doctorPosition" style="display:none;">
            <select name="position" class="selectpicker" value="${user.position}" >
                <option value="">--</option>
                <c:forEach var="item" items="${doctor_professional_title }">
                    <option value="${item.itemCode }">${item.itemName }</option>
                </c:forEach>
            </select>
        </div>
        <div id="nursePosition" style="display:none;">
            <select name="position" class="selectpicker" value="${user.position}" >
                <option value="">--</option>
                <c:forEach var="item" items="${nurse_professional_title }">
                    <option value="${item.itemCode }">${item.itemName }</option>
                </c:forEach>
            </select>
        </div>
    </div>
</div>
<script src="${ctx }/framework/jquery/1.11.3/jquery.form.js?version=${version}"></script>
    <script type="text/javascript">
    var accountExists = false;
    var checkedParentId = "";
        $(function() {
          //表格高度--超过滑动
            $("#table1").css({"max-height":$(window).height()-150});
            addEvents();
            refreshTable();
            //添加校验
            addValidate();
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                laydate.render({
                    elem:'#birthdayShow',
                    theme : '#31AAFF'
                });
            });
        });
        
        function addEvents() {
            $("#searchRow").on("keydown","#search",function(event) {
                if (event.keyCode == 13) {
                    refreshTable();
                }
            });
            
            $("input[name='roleId']").click(function(){
                if($(this).is(":checked")){
                    var exists = false;
                    var parentId= $(this).attr("parentId");
                    $("input[name='roleId']:checked").each(function(){
                        if(parentId != $(this).attr("parentId")){
                            exists = true;
                            return false;
                        }
                    });
                    if(exists){
                        showWarn("用户角色只能存在一种分类");
                        return false;
                    };
                    if(checkedParentId.indexOf(parentId) == -1){
                        getPositionHtml(parentId);
                    }else{
                        if(isEmpty(checkedParentId)){
                            getPositionHtml(parentId);
                        }
                        checkedParentId = parentId;
                    }
                }else{
                    if($("input[name='roleId']:checked").length==0){
                        $("#position").html("");
                        checkedParentId = "";
                    }
                }
            });
        }
        function getPositionHtml(parentId){
            if(isEmpty(parentId)){
                return ;
            }
            if(parentId.indexOf('2') != -1){
                $("#position").html($("#doctorPosition").html());
            }else if(parentId.indexOf('3') != -1){
                $("#position").html($("#nursePosition").html());
            }else if(parentId.indexOf('1') != -1){
                $("#position").html('<input type="text" name="position" maxlength="32" value="管理员" maxlength="32"/>');
            } else if (parentId.indexOf('4') != -1){
                $("#position").html('<input type="text" name="position" maxlength="32" value="其他" maxlength="32" />');
            }
        }

        function refreshTable() {
            var search = $("#search").val();
            $.ajax({
                url : ctx + "/system/selectUserWithFilter.shtml",
                data : encodeURI("search=" + search),
                type : "post",
                loading : true,
                dataType : "json",
                success : function(items) {
                    var tableHtml="";
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        tableHtml += "<tr>";
                        tableHtml += "<td class='xtt-5'><img src='"+ctx+"/images"+item.imagePath+"'></td>";
                        tableHtml += "<td class='xtt-16'>" + convertEmpty(item.account) + "</td>";
                        tableHtml += "<td class='xtt-16'>" + convertEmpty(item.name) + "</td>";
                        tableHtml += "<td class='xtt-18'>" + convertEmpty(item.mobileShow) + "</td>";                        
                        tableHtml += "<td>" + convertEmpty(item.roleName) + "</td>";
                        tableHtml += "<td class='xt-3'>" + convertEmpty(item.subPhone) + "</td>";
                        tableHtml += "<td class='xtt-18'>";
                        tableHtml+="<button type='button' text class='u-btn-red' onclick=\"deleteItem('" + item.id+ "');\">删除</button>";
                        tableHtml+="<button type='button' text class='u-btn-blue' onclick=\"edit('" + item.id + "');\">修改</button>";
                        tableHtml+="<button type='button' text class='u-btn-blue' onclick=\"resetPassword('" + item.id+ "');\">密码重置</button></td>";
                        tableHtml += "</tr>";
                    }
                    $("#tableBody").html(tableHtml);
                }
            });
        }
        
        function addUser(){
            clearForm("userInfoForm");
            $("input[name='sex']:eq(0)").prop("checked",true);
            $("#position").html("");
            $("#imgShow").attr("src","");
            $("#title_show").html("新增用户(默认密码:123456)");
            checkedParentId = "";
        }
    
        function edit(itemId) {
            $.ajax({
                url : ctx + "/system/getFullUser.shtml",
                data : "id=" + itemId,
                type : "post",
                dataType : "json",
                success : function(data) {// ajax返回的数据
                    if (data) {
                        getPositionHtml(data.parentRoleId);//获取职称的值
                        checkedParentId = data.parentRoleId;
                        mappingFormData(data,"userInfoForm");
                        //图片显示
                        $("#imgShow").attr("src",ctx+"/images"+data.imagePath);
                        $("#title_show").html("用户信息修改");
                    }
                }
            });
            popDialog("#promptDialog");
        }

        function deleteItem(itemId) {
            showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
                $.ajax({
                    url : ctx + "/system/deleteUser.shtml",
                    data : "id=" + itemId,
                    type : "post",
                    dataType : "json",
                    success : function(data) {// ajax返回的数据
                        if (data) {
                            if (data.status == 1) {
                                refreshTable();
                            }else {
                                showWarn(data.errmsg);
                            }
                        }
                    }
                });
            });
        }
        
        function resetPassword(itemId){
            showWarn("您确定要重置该用户密码吗？", function() {
                $.ajax({
                    url : ctx + "/system/resetUser.shtml",
                    data : "id=" + itemId,
                    type : "post",
                    dataType : "json",
                    success : function(data) {// ajax返回的数据
                        if (data) {
                            if (data.status == 1) {
                                alert("重置成功,新密码为 '123456'");
                            }
                        }
                        return;
                    }
                });
            });
        }

        $("#account").change(function() {
            var account = $(this).val();
            if (!isEmpty(account)) {
                accountExists = false;
                $.ajax({
                    url : ctx + "/system/checkAccountExists.shtml",
                    data : "account=" + account,
                    type : "post",
                    dataType : "json",
                    success : function(data) {// ajax返回的数据
                        if (data) {
                            if (data.status == 2) {
                                showWarn("该用户已经存在");
                                accountExists = true;
                                return false;
                            }else if(data.status == 1){
                                accountExists = false;
                                return false;
                            }
                        }
                    }
                });
            }
        });

        function updateUserInfo() {
            var currentFormData = $("#userInfoForm").serialize();
            if(!$('#userInfoForm').valid()){
                return false;
            }
            $.ajax({
                url : ctx + "/system/saveUser.shtml",
                data : currentFormData,
                type : "post",
                dataType : "json",
                loading : true,
                success : function(data) {// ajax返回的数据
                    if (data) {
                        if (data.status == 1) {
                            refreshTable();
                            $("#promptDialog").hide();
                        } else if (data.status == 2) {
                            showWarn("用户角色不能为空");
                            return false;
                        } else if(data.status == 0){
                            showWarn("账户名已存在");
                            return false;
                        }
                    }
                }
            });
        }
        function addValidate(){
            $('#userInfoForm').validate({
                onfocusout : false,
                // 校验字段
                rules : {
                    account : {
                        required : [ "账号" ]
                    },
                    name : {
                        required : [ "姓名" ]
                    },
                    roleId : {
                        required : ['角色']
                    },
                    birthdayShow:{
                        date : ["生日"]
                    },
                    mobile : {
                        digits : [ "手机号" ],
                        customMaxlength : [ 11, "手机号" ]
                    },
                    subPhone : {
                        customMaxlength : [ 64, "其他联系方式" ]
                    },
                    sysOwner : {
                        required : ['所属系统']
                    },
                    position : {
                        required : ['职称']
                    }
                },
                messages : {
                    mobile : {
                        customMaxlength : "请输入正确的手机号",
                            digits: "请输入正确的手机号"
                    }
                },

                // 全部校验结果
                showErrors : function(errorMap, errorList) {
                    showSystemDialog(errorMap);
                },
                submitHandler : function(form) {
                    form.onsubmit();
                }
            });
        }
        
        /**
         * 上传头像
         */
        $("#up_img").change(function() {
            uploadImg($("#imageUploadForm"));
        });

        function uploadImg(form) {
            if (isEmpty($("#up_img").val())) {
                showWarn("请选择上传的文件");
                return false;
            }
            var options = {
            dataType : "json",
            url : ctx + "/patient/savePatientImage.shtml?id=" + $("#id").val(),
            success : function(data) {// ajax返回的数据
                if (data) {
                    if (data.status == 1) {
                        $("#imagePath").val(data.filepath);
                        $("#imgShow").attr("src",ctx+"/images"+data.filepath);
                        return false;
                    } else if (data.status == 2) {
                        showWarn("请选择上传的文件");
                        return false;
                    }
                }
            }
        };
        $(form).ajaxSubmit(options);
        return false;
        }
    </script>
  </body>
</html>