<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head.jsp"%>
<title>系统模板维护</title>
<style type="text/css">
.input-style {
	margin-bottom: 0px;
}

.dialog-wrap .input-style {
	width: 180px !important;
}

.input-style.width-300 {
	width: 300px !important;
	min-width: 0px !important;
}
</style>
</head>
<body onresize="resizeTemplate();">
	<div class="container-fluid">
		<div class="row">
			<input type="hidden" id="sysOwner" value="${sysOwner }">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				<div class="list-card-item">
					<div class="tab-header">
						<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">模板列表</span>
						<div class="tab-action hand margin-right-25" onclick="showTemplateDialog();">
							<div class="dividing-line"></div>
							<div class="new-btn"></div>
							<span class="pull-right action-name">添加数据</span>
						</div>
					</div>
					<div class="tab-body">
            			<div class="col-sm-3 col-md-2 bg-white" style="padding-right:1px" id="templateTypeList">
							<div style="text-align: left; font-size: 14px;" id="templateTypeSearchCount"></div>
							<img src="${ctx }/assets/img/pad/search-icon.png" class="pad-search-icon" style="position: absolute; top: 15px; left: 20px;">
							<input class="nav-search-input fill-parent" style="width: 88%;" type="search" placeholder="搜 索" id="searchTemplate">
							<div class="fill-parent" id="templateList" style="height: 397px; overflow-y: auto; overflow-x: hidden;">
								<c:forEach items="${list }" var="item">
				                    <div class="nav-search-result" style="min-height:40px;height:auto;" onclick="getTemplateBody(this);" data-type="${item.type}" data-typeDesc="${item.typeDesc}">
				                    	<span style="max-width: inherit;">${item.typeDesc}</span>
				                    </div>
								</c:forEach>
							</div>
						</div>
						<div class="col-sm-9 col-md-10" style="height: 397px; overflow: auto;padding-right: 0px;padding-left:10px;" id="detailList">
							<div class="table-responsive bg-white">
								<table class="table">
									<thead>
										<th width="20%">标题</th>
										<th width="40%">内容</th>
										<th width="10%">排序</th>
										<th width="30%">操作</th>
									</thead>
									<tbody id="templateBody">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- 新建数据 dialog -->
				<div class="modal" id="templateDialog" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog">
						<div class="modal-content" style="min-width: 600px;">
								<div class="modal-header">
									<h4 class="modal-title">添加选项</h4>
								</div>
								<div class="modal-body">
									<form id="templateForm" method="post">
										<div class="dialog-wrap" style="width: inherit;">
											<div class="list-group bg-white">
												<input type="hidden" name="id">
												<input type="hidden" id="type" name="type">
												<input type="hidden" id="typeDesc" name="typeDesc">
												<input type="hidden" name="delFlag" value="0">
												<div class="list-group-item margin-top-20">
													<span class="list-group-item-title">分类：</span>
													<span class="list-group-item-title width-300" id="typeDescShow"></span>
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">标题：</span>
													<input class="input-style width-300" type="text" name="title" maxlength="32" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">内容：</span>
													<input class="input-style width-300" type="text" name="content" maxlength="512" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">排序：</span>
													<input class="input-style width-300" type="number" name="orderBy" maxlength="3" />
												</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<span class="dialog-btn-close dialog-btn-size" data-dismiss="modal">取消</span>
									<span class="dialog-btn-ok dialog-btn-size" id="btnSave">确定</span>
								</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="${ctx }/framework/jquery/jquery.fastLiveFilter.js?version=${version}"></script>
	<script type="text/javascript">
		$(function() {
			$('#searchTemplate').fastLiveFilter('#templateList');//初始化过滤器
			addValidate();
			resizeTemplate();
			
			$("#btnSave").click(function() {
				if (!$("#templateForm").valid()) {
					return false;
				}
				saveTemplate($("#templateForm").serialize());
				$("#templateDialog").modal("hide");
			});
		});

		function resizeTemplate() {
			$("#templateTypeList").css("height", $(window).height() - 200);
			$("#detailList").css("height", $("#templateTypeList").css("height"));
		}

		/**字典类别点击事件 */
		function showTemplateDialog() {
			if ($("#templateList .nav-search-result.active").length == 0) {
				showError("请先选择分类");
				return false;
			}
			$("#templateForm")[0].reset();
			$("#templateDialog").modal("show");
		}

		/** 获取table数据 */
		function getTemplateBody(obj) {
 			$(obj).addClass("active").siblings().removeClass("active");
 			var type = $(obj).attr("data-type");
 			$("#templateForm")[0].reset();
			$("#templateForm input[name='id']").val("");
			$("#templateForm input[name='type']").val(type);
			$("#templateForm input[name='typeDesc']").val($(obj).attr("data-typeDesc"));
			$("#templateForm span[id='typeDescShow']").html($(obj).attr("data-typeDesc"));
			$("#specialCare :checkbox").prop("checked",false);
			$("#specialCare").hide();
			if(type=="001"){
				$("#specialCare").show();
			}
			$.ajax({
				url : ctx + "/system/template/selectByType.shtml",
				data : "type=" + type+"&sysOwner="+$("#sysOwner").val(),
				dataType : "json",
				loading:true,
				success : function(data) {
					if (data.status == 1) {
						var bodyHtml = "";
						$("#templateBody").data("items",data.list);
						if(type=="001" || type=="005"){
							for (var i = 0; i < data.list.length; i++) {
								var item = data.list[i];
								bodyHtml += '<tr data-type="'+item.type+'">';
								bodyHtml += '<td class="text-center">' + convertEmpty(item.title) + '</td>';
								bodyHtml += '<td class="text-center">' + convertEmpty(item.content) + '</td>';
								bodyHtml += '<td class="text-center">' + convertEmpty(item.orderBy) + '</td>';
								bodyHtml += '<td>';
								bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="modifyTemplate(this,' + item.id + ')">修  改</button>';
								bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="deleteTemplate(this,' + item.id + ')">删除</button>';
								bodyHtml += '</td>';
								bodyHtml += '</tr>';
							}
						}else{
							for (var i = 0; i < data.list.length; i++) {
								var item = data.list[i];
								bodyHtml += '<tr data-type="'+item.type+'">';
								bodyHtml += '<td class="text-center" style="padding:8px;"><textarea name="title" style="background-color:white;width:100%;" maxlength="32">' + convertEmpty(item.title) + '</textarea></td>';
								bodyHtml += '<td class="text-center" style="padding:8px;"><textarea name="content" style="width:100%;" cols=40 maxlength="512">' + convertEmpty(item.content) + '</textarea></td>';
								bodyHtml += '<td class="text-center"><input type="number" class="tl-input" name="orderBy" value="' + convertEmpty(item.orderBy) + '" maxlength="3" /></td>';
								bodyHtml += '<td>';
								bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="updateTemplate(this,' + item.id + ')">更  新</button>';
								bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="deleteTemplate(this,' + item.id + ')">删除</button>';
								bodyHtml += '</td>';
								bodyHtml += '</tr>';
							}
						}
						$("#templateBody").html(bodyHtml);
					}
				}
			});
		}
		
		/** 更新字典表 */
		function updateTemplate(element,itemId){
			//更新数据操作
			var parentObj = $(element).parent().parent();
			var orderBy = parentObj.find("input[name='orderBy']").val();
			var title = parentObj.find("textarea[name='title']").val();
			var content = parentObj.find("textarea[name='content']").val();
			var errorMap = {};
			if(isEmpty(title)){
				errorMap["title"] = "标题不能为空";
			}
			if(isEmpty(content)){
				errorMap["content"] = "内容不能为空";
			}
			if(isEmpty(orderBy)){
				errorMap["orderBy"] = "排序的值不能为空";
			}else if(!isPInt(orderBy)){
				errorMap["orderBy"] = "排序的值只能为正整数";
			}
			if(isEmptyObject(errorMap)){
				var data = "id="+itemId+"&title="+title+"&content="+content+"&orderBy="+orderBy+"&type="+parentObj.attr("data-type");
				saveTemplate(data);
			}else{
				showSystemDialog(errorMap, "info");
			}
			return false;
		}
		/**修改模板 */
		function modifyTemplate(obj, id){
			$("#specialCare :checkbox").prop("checked",false);
			var items = $("#templateBody").data("items");
			for(var i=0;i<items.length;i++){
				if(items[i].id==id){
					mappingFormData(items[i], "templateForm");
					$("#specialCare :checkbox").each(function(){
						for(var t=0;t<items[i].childList.length;t++){
							var item = items[i].childList[t];
							if($(this).val()==item.content){
								$(this).prop("checked",true);
								break;
							}
						}
					});
					$("#templateDialog").modal("toggle");
					break;
				}
			}
			return false;
		}
		
		function deleteTemplate(obj, id) {
			$.ajax({
				url : ctx + "/system/template/deleteTemplate.shtml",
				data : "id=" + id,
				dataType : "json",
				loading : true,
				success : function(data) {
					if (data.status == 1) {
						$(obj).parent().parent().remove();
					}
				}
			});
		}
		
		function saveTemplate(data) {
			$.ajax({
				url : ctx + "/system/template/saveTemplate.shtml",
				data : data+"&sysOwner="+$("#sysOwner").val(),
				dataType : "json",
				type : "post",
				loading : true,
				success : function(data) {
					if (data.status == 1) {
						$("#templateList .nav-search-result.active").click();
					}
				}
			});
		}
		
		/* --------------template end---------------- */
		/** 添加校验 */
		function addValidate() {
			$('#templateForm').validate({
				onfocusout : false,
				// 校验字段
				rules : {
					title : {
						required : [ "标题" ]
					},
					content : {
						required : [ "内容" ]
					},
					orderBy : {
						required : [ "排序" ],
						isPInt : [ "排序" ]
					}
				},
				// 全部校验结果
				showErrors : function(errorMap, errorList) {
					showSystemDialog(errorMap);
				}
			});
		}
	</script>
</body>
</html>