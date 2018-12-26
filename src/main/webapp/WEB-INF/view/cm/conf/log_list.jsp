<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>用户管理</title>
<%@ include file="../../common/head.jsp"%>
<link href="${ctx }/framework/bootstrap/datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" media="screen">
<script type="text/javascript" src="${ctx }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.js" charset="UTF-8"></script>
<script type="text/javascript" src="${ctx }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				<form id="queryForm">
					<input type="hidden" id="pageNo" name="pageNo" value="1">
					<input type="hidden" id="pageSize" name="pageSize" value="15">
					<input type="hidden" id="totalPage" name="totalPage" value="0">
					<input type="hidden" name="sysOwner" value="${sysOwner }">
					
					　　<span class="tl-tip">操作人姓名</span> <input class="tl-input" type="text" name="name"> 
					<span class="tl-tip">操作时间</span> <input class="tl-input form-control width-150" style="background-color: #fff;display: inline-block;" type="text" name="startDate"  readonly="readonly" datetimepicker>
					- <input class="tl-input form-control width-150" style="background-color: #fff;display: inline-block;" type="text" name="endDate"  readonly="readonly" datetimepicker>
					<span class="tl-tip"></span>
					<button type="button" class="btn btn-def" id="btnReset">重置</button>
					<button type="button" class="btn btn-def margin-left-15" id="btnSearch">查询</button>
				</form>
				<div class="table-responsive bg-white">
					<table class="table">
						<thead>
							<tr>
								<th>操作人</th>
								<th>操作时间</th>
								<th>操作说明</th>
								<!-- <th>详细</th> -->
							</tr>
						</thead>
						<tbody id="tableBody">
						</tbody>
					</table>
				</div>
	            <div class="fill-parent bg-white">
	                <div class="msg-list-item text-center loading-tip" id="btnReload">
						加载更多
	                </div>
	            </div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		$(document).ready(function() {
			$("input[datetimepicker]").datetimepicker({
				language : 'zh-CN',
				format : 'yyyy-mm-dd',
				weekStart : 1,
				todayBtn : 1,
				autoclose : 1,
				todayHighlight : 1,
				startView : 2,
				minView : 2,
				forceParse : 0
			});
			
			// 刷新日志数据
			function refresh() {
				$.ajax({
					url : ctx + "/system/selectSysLog.shtml",
					data : $("#queryForm").serialize(),
					type : "post",
					dataType : "json",
					success : function(data) {
						if (data.status == '1') {
							var list = data.entity.results;
							var html = "";
							var obj;
							$("#secretaryMsgContent").html("");
							for (var i = 0; i < list.length; i++) {
								obj = list[i];
								// 渲染小学童
								html = '<tr class="table-default">';
								html += '	<td>' + obj.name + '</td>';
								html += '	<td>' + obj.logTimeShow + '</td>';
								html += '	<td style="text-align:left">' + obj.logInfo + '</td>';
								//html += '	<td><a>详细</a> </td>';
								html += '</tr>';
								$("#tableBody").append(html);
							}
							$("#totalPage").val(data.entity.totalPage);
							if ($("#pageNo").val() == $("#totalPage").val()) {
								$("#btnReload").html("已全部加载");
								$("#btnReload").removeClass("hand");
								$("#btnReload").unbind("click");
							} else {
								$("#btnReload").html("加载更多");
								$("#btnReload").addClass("hand");
								$("#btnReload").unbind("click");
								$("#btnReload").bind("click", loadMore);
							}
						}
					}
				});
			}
			
			refresh();
	
			// 加载更多
			function loadMore() {
				var pageNo = parseInt($("#pageNo").val());
				$("#pageNo").val(pageNo + 1);
				$("#btnReload").html("加载中...");
				refresh();
			}
			
			// 重置
			$("#btnReset").click(function() {
				$("#queryForm")[0].reset();
			});

			// 查询
			$("#btnSearch").click(function() {
				$("#tableBody").html("");
				$("#pageNo").val(1);
				refresh();
			});
		});
	</script>
</body>
</html>