<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head.jsp"%>
<title>公式配置页面</title>
</head>
<body class="bg-white">
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				<div class="table-responsive bg-white">
					<table class="table">
						<thead>
							<tr><th width="20%">类别名称</th><th width="80%">公式详情</th></tr>
						</thead>
					</table>
				</div>
				<div class="tab-body">
					<div class="table-responsive bg-white" id="tableDiv" style="position:relative;width: 100%;">
						<table class="table">
							<tbody>
								<c:forEach var="item" items="${items }">
									<tr>
										<td width="20%">${item.value.categoryName }</td>
										<td width="80%">
											<c:forEach var="record" items="${item.value.children }">
												<div data-value>
													<div class="col-xt-3"><label>
														<input type="radio" name="${item.value.category }" value="${record.id }" <c:if test="${record.isChecked }">checked</c:if> />
														${record.itemName }
													</label></div>
													<div class="col-xt-9"><textarea class="textarea-auto-height min-h-38" style="width:100%;" name="itemDesc" required="required">${record.itemDesc }</textarea></div>
												</div>
											</c:forEach>
										</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
					<div class="text-center margin-top-15">
						<button class="btn btn-def" onclick="formula.save();">保存</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<link href="${ctx }/framework/jquery/scrollbar/perfect-scrollbar.min.css" rel="stylesheet">
	<script src="${ctx }/framework/jquery/scrollbar/perfect-scrollbar.jquery.min.js" charset="UTF-8"></script>
	<script type="text/javascript">
		$(function() {
			formula.init();
		});
		var formula = {
			init:function(){
				$("#tableDiv").perfectScrollbar();
				formula.addEvents();
			},
			addEvents:function(){
				$(window).on("resize",function(){
					$("#tableDiv").css("height",($(window).height()-$("#tableDiv").offset().top-65));
					$('#tableDiv').perfectScrollbar("update");
				});
			},
			save:function(){
				var datas = [];
				var errors = [];
				$("#tableDiv [data-value]").each(function(){
					var radio = $(this).find(":radio");
					var desc = $(this).find("[name='itemDesc']").val();
					if(isEmpty(desc)){
						errors.push(radio.parent().text()+"的公式描述不能为空");
					}else{
						datas.push({
							id:radio.val(),
							isChecked:radio.is(":checked"),
							itemDesc:desc
						});
					}
				});
				if(!isEmptyObject(errors)){
					showWarn(errors);
					return false;
				}
				$.ajax({
					url : ctx + "/cmFormulaConf/save.shtml",
					data : JSON.stringify(datas),
					contentType : 'application/json;charset=utf-8',
					type : "post",
					dataType : "json",
					loading : true,
					success : function(data) {// ajax返回的数据
						if (data) {
							if (data.status == 1) {
								window.location.reload(true);
							}
						}
					}
				});
			}
		};
	</script>
</body>
</html>