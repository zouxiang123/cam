<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head.jsp"%>
<title>字典参数维护</title>
<style type="text/css">
.select {
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	-border-radius: 4px;
	border: 1px solid #d9e0e6;
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	margin-left: 14px;
	height: 32px;
	min-width: 180px;
	text-align: center;
	background: url("${ctx }/assets/img/arrow.png") no-repeat scroll right center transparent;
}

tbody tr.active {
	color: #fff !important;
}

tbody tr.active td {
	background: #31AAFF !important;
}

.select::-ms-expand {
	display: none;
}

.input-style {
	margin-bottom: 0px;
}

.dialog-wrap .input-style {
	width: 180px !important;
}

.input-style.width-70 {
	width: 71px !important;
	min-width: 70px !important;
}

.input-style.width-300 {
	width: 300px !important;
	min-width: 0px !important;
}
</style>
</head>
<body class="bg-white" style="padding: 0px;">
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main" style="padding: 0px;">
				<div class="fill-parent rel bg-white border-bottom-line" style="height: 48px;">
					<div class="tab-index" style="width: auto;" id="dictionaryTopTab">
						<span class="tab-index-item active" data-type="dictionary">字典表</span> 
						<!-- <span class="tab-index-item-center" data-type="assay">化验单</span> -->
					</div>
					<div class="tab-action" onclick="dict_maintain.refreshMemory();" style="margin: 20px 34px;">
						<div class="dividing-line"></div>
						<span>刷新缓存</span><img src="${ctx }/assets/img/refresh.png" class="refresh">
					</div>
				</div>
				<!-- 字典表 -->
				<div id="dictionary">
					<!-- 新建数据 dialog -->
					<div class="modal" id="dictionaryAddDialog" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
						<div class="modal-dialog">
							<div class="modal-content" style="min-width: 600px;">
								<form id="dictionaryAddForm" method="post" onsubmit="return false;" action="${ctx }/system/dictionary/updateDictionary.shtml">
									<div class="modal-header">
										<h4 class="modal-title">新增检查项</h4>
									</div>
									<div class="modal-body">
										<div class="dialog-wrap" style="width: inherit;">
											<div class="list-group bg-white">
												<div class="list-group-item margin-top-10">
													<span class="list-group-item-title">类别&nbsp;key：</span> <input class="input-style width-300" type="text" name="pItemCode" maxlength="64" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">类别名称：</span> <input class="input-style width-300" type="text" name="itemDesc" maxlength="127" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">项目编码：</span> <input class="input-style width-300" type="text" name="itemCode" maxlength="32" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</span> <input class="input-style width-300" type="text"
														name="itemName" maxlength="64" />
												</div>
												<div class="list-group-item">
													<span class="list-group-item-title">排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序：</span> <input class="input-style width-300" type="text"
														name="orderBy" maxlength="3" />
												</div>
											</div>
										</div>
									</div>
									<input type="hidden" name="pid" value="0"> <input type="hidden" name="isEnable" value="true">
									<div class="modal-footer">
										<span class="dialog-btn-close dialog-btn-size" data-dismiss="modal">取消</span> <span class="dialog-btn-ok dialog-btn-size"
											onclick="dict_maintain.saveAddDictionary('dictionaryAddForm','dictionaryAddDialog',true);">确定</span>
									</div>
								</form>
							</div>
						</div>
					</div>
					<!-- end of 新建数据 dialog -->
					<form method="post" class="hide" id="dictionaryQueryForm" action="#" onsubmit="return false;">
						<input type="hidden" name="pItemCode">
					</form>
					<div class="list-card-item">
						<div class="tab-header">
							<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">数据列表</span>
							<div class="tab-action hand margin-right-25" onclick="dict_maintain.showAddDialog('dictionaryAddDialog');">
								<div class="dividing-line"></div>
								<div class="new-btn"></div>
								<span class="pull-right action-name">添加数据</span>
							</div>
						</div>
						<div class="tab-body">
							<div class="col-sm-3 col-md-2 bg-white" style="padding-right: 1px;" id="dictionaryCategoryList">
								<div style="text-align: left; font-size: 14px;" id="dictionaryCategorySearchCount"></div>
								<img src="${ctx }/assets/img/search-icon.png" class="pad-search-icon" style="position: absolute; top: 37px; left: 20px;"> 
                                <input class="nav-search-input fill-parent" style="width: 88%;" type="search" placeholder="搜 索" id="dictionaryCategorySearch">
								<div class="fill-parent" id="dictionaryCategorySearchContent" style="height: 397px; overflow-y: auto; overflow-x: hidden;"></div>
							</div>
							<div class="col-sm-9 col-md-10" style="height: 397px; overflow: auto; padding-right: 0px; padding-left: 10px;" id="dictionaryList">
								<div class="table-responsive bg-white">
									<table class="table">
										<thead>
											<th>类别key</th>
											<th>类别名称</th>
											<th>项目编码</th>
											<th>名称</th>
											<th>排序</th>
											<th>是否有效</th>
											<th></th>
										</thead>
										<tbody id="dictionaryTableBody">
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 字典表 -->
				<!-- 化验单 -->
				<div id="assay" style="display: none;">
					<div class="col-sm-12 col-md-12" id="assayMappingDiv">
						<div class="list-card-item">
							<div class="tab-header">
								<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">未匹配列表</span>
							</div>
							<div class="tab-body">
								<div class="col-sm-6 col-md-6 p-r-0 p-l-0">
									<div class="table-responsive bg-white" style="overflow-x: hidden; overflow-y: auto; max-height: 400px;" id="hospitalAssayTable">
										<table class="table">
											<thead>
												<th><span>分组名称</span></th>
												<th><span>项目代号</span></th>
												<th><span>项目名称</span></th>
											</thead>
											<tbody id="hospitalAssayTableBody">
											</tbody>
										</table>
									</div>
								</div>
								<div class="col-sm-2 col-md-1 p-r-0" style="padding-left: 5px;">
									<button class="btn btn-def" style="width: 80px;" onclick="dict_maintain.mappingAssayDict();">关联</button>
								</div>
								<div class="col-sm-4 col-md-5 p-r-0 p-l-0">
									<div class="table-responsive bg-white" style="overflow-x: hidden; overflow-y: auto; max-height: 400px;" id="sysAssayTable">
										<table class="table">
											<thead>
												<th><span>项目代号</span></th>
												<th><span>项目名称</span></th>
											</thead>
											<tbody id="sysAssayTableBody">
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-12 col-md-12">
						<div class="list-card-item">
							<div class="tab-header">
								<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">已匹配列表</span>
							</div>
							<div class="tab-body">
								<div class="table-responsive bg-white" style="overflow-x: hidden; overflow-y: auto; max-height: 300px;" id="assayTable">
									<table class="table">
										<thead>
											<!-- <th><span>分组编号</span></th> -->
											<th><span>分组名称</span></th>
											<th><span>项目代号</span></th>
											<th><span>项目名称</span></th>
											<!-- <th><span>结果类型</span></th> -->
											<th><span>参考值</span></th>
											<th><span>单位</span></th>
											<th><span>关联编码</span></th>
											<th><span>关联名称</span></th>
											<th></th>
										</thead>
										<tbody id="assayTableBody">
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 化验单 end-->
			</div>
		</div>
	</div>
	<script src="${ctx }/framework/jquery/jquery.fastLiveFilter.js"></script>
    <script src="${ctx }/assets/js/cm/conf/dictionary_maintain.js?version=${version}"></script>
	<script type="text/javascript">
    dict_maintain.init("${sysOwner}");
	</script>
</body>
</html>
