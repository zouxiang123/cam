<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>用户管理</title>
<%@ include file="../../common/head.jsp"%>
<style type="text/css">
	.list-sm-item-separator {
		background-color:#E8E8E8;
		padding:0px 28px;
		height:20px;
	}
</style>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
			    <div class="simple-line bg-white border-bottom-line">
			        <span class="tabbar active" id="person">医生/护士/患者导入</span>
			    </div>
				<div id="personDiv">
					<div style="margin:0px 0px 10px 30px; width:80%;min-width:300px;line-height: 40px;">
						<button type="button" onclick="downloadTemplate('excelImportTemplate.xls')" class="btn btn-def" style="display: inline-block;">模板下载</button>
						<div  style="display: inline-block;margin-left:10px;">
							<form action="${ctx }/excel/upload.shtml" onsubmit="return uploadPersonExcel(this);" enctype="multipart/form-data" method="post">
								<input type="file"  name="excel" id="personAttachment" accept=".xls,.xlsx" style="display:none;" onchange="$('#personPath').val($('#personAttachment').val())" />
								<input type="text" id="personPath" style="width:350px;min-height:30px;display: inline-block;"  placeholder="文件大小不能超过6M" readonly/>
								<input type="hidden" name="sysOwner" value="${sysOwner }" id="sysOwner"/>
								<button type="button" style="display: inline-block;" onclick="$('#personAttachment').click();" class="btn btn-def">选择文件</button>
								<button type="submit" class="btn btn-def" style="display: inline-block;">上传</button>
							</form>
						</div>
					</div>
					<div class="list-item">
						<div class="tab-header">
							<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">导入结果</span>
						</div>
						<div class="tab-body">
							<div class="table-responsive bg-white">
								<table class="table table-style">
									<tbody>
										<tr class="list-item-content detail-hide">
											<div class="list-sm-group">
												<div class="list-sm-item list-sm-item-separator">
													<span class="pull-left"></span> <span class="list-sm-item-title">患者</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item">
													<span class="ready pull-left margin-top-6"></span> <span class="list-sm-item-title">成功</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="patientSuccess">
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto">
													<span class="not-ready pull-left margin-top-6"></span> <span class="list-sm-item-title">失败</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="patientError">
												</div>
											</div>
										</tr>
										<tr class="list-item-content detail-hide">
											<div class="list-sm-group">
												<div class="list-sm-item list-sm-item-separator">
													<span class="pull-left"></span> <span class="list-sm-item-title">医生</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item">
													<span class="ready pull-left margin-top-6"></span> <span class="list-sm-item-title">成功</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="doctorSuccess">
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto">
													<span class="not-ready pull-left margin-top-6"></span> <span class="list-sm-item-title">失败</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="doctorError">
												</div>
											</div>
										</tr>
										<tr class="list-item-content detail-hide">
											<div class="list-sm-group">
												<div class="list-sm-item list-sm-item-separator">
													<span class="pull-left"></span> <span class="list-sm-item-title">护士</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item">
													<span class="ready pull-left margin-top-6"></span> <span class="list-sm-item-title">成功</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="nurseSuccess">
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto">
													<span class="not-ready pull-left margin-top-6"></span> <span class="list-sm-item-title">失败</span>
												</div>
											</div>
											<div class="list-sm-group">
												<div class="list-sm-item" style="height:auto" id="nurseError">
												</div>
											</div>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="${ctx }/framework/jquery/1.11.3/jquery.form.js"></script>
	<script type="text/javascript">
		$(function(){
			$(".tabbar").click(function() {
				$(".tabbar").addClass("active").siblings().removeClass("active");
				var id = $(this).attr("id");
				$(".tabbar").each(function(){
					var divId = "#"+$(this).attr("id")+"Div";
					if($(this).attr("id") == id){
						$(divId).removeClass('hide');
					}else{
						if(!$(divId).hasClass("hide")){
							$(divId).addClass('hide');
						}
					}
				});
			});
		});
	
		function uploadPersonExcel(form){
			if(isEmpty($("#personAttachment").val())){
				showWarn("请选择文件");
				return false;
			}
			var options = {
				dataType : "json",
				url : ctx + "/excel/upload.shtml",
				loading:true,
				timeout: 0, //不设置超时
				loadingMsg:"正在导入,请稍后...",
				success : function(data) {// ajax返回的数据
					$("#patientSuccess").html("");
					$("#doctorSuccess").html("");
					$("#nurseSuccess").html("");
					if(data.status == 1){
						var result = data.result;
						if(result.status == 2){
							showWarn(data.result.error);
							return false;
						}else if(result.status == 1){
							$("#patientSuccess").html(result.patientCount>0?"<span class='list-sm-item-title margin-left-64'>共导入"+result.patientCount+"名患者</span>":"");
							$("#doctorSuccess").html(result.doctorCount>0?"<span class='list-sm-item-title margin-left-64'>共导入"+result.doctorCount+"名医生</span>":"");
							$("#nurseSuccess").html(result.nurseCount>0?"<span class='list-sm-item-title margin-left-64'>共导入"+result.nurseCount+"名护士</span>":"");
							if(!isEmptyObject(result.patientError)){
								var str = "<span class='list-sm-item-title margin-left-64'>"+result.patientErrorCount+"名患者导入失败</span><br/>";
								str += getErrorStr(result.patientError);
								$("#patientError").html(str);
							}
							if(!isEmptyObject(result.doctorError)){
								var str = "<span class='list-sm-item-title margin-left-64'>"+result.doctorErrorCount+"名医生导入失败</span><br/>";
								str += getErrorStr(result.doctorError);
								$("#doctorError").html(str);
								
							}
							if(!isEmptyObject(result.nurseError)){
								var str = "<span class='list-sm-item-title margin-left-64'>"+result.nurseErrorCount+"名护士导入失败</span><br/>";
								str += getErrorStr(result.nurseError);
								$("#nurseError").html(str);
							}
						}
					} else if (data.stauts == 2) {
						showWarn("超出文件大小限制");
						return false;
					}
					return false;
				}
			};
			$(form).ajaxSubmit(options);
			return false;
		}
		
		function getErrorStr(json){
			var str = "";
			$.each(json, function(i) {
				str +="<span class='list-sm-item-title margin-left-64'>第"+i+"行数据导入失败&nbsp;&nbsp;&nbsp;&nbsp;原因："+json[i]+"</span><br/>";
			});
			return str;
		}
		
		function downloadTemplate(fileName){
			window.location.href = ctx + "/excel/getTemplate.shtml?fileName="+fileName; 
		}
		
	</script>
</body>
</html>