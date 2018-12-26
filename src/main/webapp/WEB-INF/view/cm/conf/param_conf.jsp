<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head.jsp"%>
<title>学透通管理中心</title>
<style type="text/css">
.select {
    -moz-border-radius:4px;
    -webkit-border-radius:4px;
    -border-radius:4px;
    border:1px solid #dfdfdf;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    padding-right: 14px;
    min-width: 160px;
    text-align: center;
    font:inherit;
    background: url("${ctx}/assets/img/arrow.png") no-repeat scroll right center transparent;
}

.select::-ms-expand { display: none; }
</style>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				 <div class="tab-header">
					<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">参数列表</span>
					<div class="tab-action" onclick="refreshMemory();">
						<div class="dividing-line"></div>
						<span>刷新缓存</span><img src="${ctx }/assets/img/refresh.png" class="refresh">
					</div>
				</div>
				<div class="tab-body">
				 	<div class="table-responsive bg-white">
				 		<table class="table">
				 			<thead>
								<tr>
									<th>参数描述</th>
									<th class="text-left" style="padding-left:30px;">参数值</th>
									<th class="text-left" style="padding-left:30px;">单位</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="item" items="${paramList }">
									<tr class="table-default">
										<td>${item.paramDesc }</td>
										<td class="text-left">
											<input type="text" class="tl-input margin-bottom-0" style="width:200px;height:30px;" name="paramValue" value="${item.paramValue }" maxlength="512"/>
										</td>
										<td class="text-left">
											<c:if test="${!empty item.dicUnitList}">
												<select name="paramUnit" class="select">
													<c:forEach var="unit" items="${item.dicUnitList }">
														<option value="${unit.itemCode }" <c:if test="${unit.isChecked }">selected="selected"</c:if> >${unit.itemName }</option>
													</c:forEach>
												</select>
											</c:if>
										</td>
										<th><input type="button" class="btn btn-def" value="更新" onclick = "saveSystemParam('${item.id}',this)" /></th>
									</tr>
								</c:forEach>
							</tbody>
				 		</table>
				 	</div>
			 	</div>
		 </div>
	 </div>
 </div>
<script type="text/javascript">
	function saveSystemParam(id,btn){
		var paramValue = $(btn).parent().parent().find("input[name='paramValue']").val();
		var paramUnit = $(btn).parent().parent().find("select[name='paramUnit']").val();
		if(isEmpty(paramValue)){
			showWarn("参数值不能为空");
			return false;
		}
		$.ajax({
			url : ctx + "/system/param/saveParam.shtml",
			data : encodeURI("id=" + id+"&paramValue="+paramValue+(isEmpty(paramUnit)?"":"&paramUnit="+paramUnit)),
			type : "post",
			dataType : "json",
			loading : true,
			success : function(data) {// ajax返回的数据
				if (data.status==1) {
					showTips("保存成功");
				}else if(data.status==2){
					showWarn("参数已存在，不能添加");
				}
			}
		});
	}
		 	
	/** 刷新内存数据 */
	function refreshMemory(){
		$.ajax({
			url : ctx + "/cacheRefresh/sysParam.shtml",
			type : "post",
			dataType : "json",
			success : function(data) {
				if(data.status == 1){
					showTips("刷新成功");
				}
			}
		});
	}
 </script>
</body>
</html>