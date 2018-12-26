<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>角色管理</title>
<%@ include file="../../common/head.jsp"%>
<link rel="stylesheet" href="${ctx }/framework/ztree/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/framework/ztree/js/jquery.ztree.core.min.js"></script>
<script type="text/javascript" src="${ctx }/framework/ztree/js/jquery.ztree.excheck.min.js"></script>
<script type="text/javascript" src="${ctx }/framework/ztree/js/jquery.ztree.exedit.min.js"></script>
<style type="text/css">
.tree-block {
	min-width:250px;
	max-width:600px;
	padding-bottom:20px;
	border-radius: 3px;
}
.ztree {
	margin: 20px 10px 20px 20px;
	border: 1px solid #EDEFF0;
	-webkit-box-shadow:2px 2px 2px 2px #EDEFF0 inset;
	box-shadow:2px 2px 2px 2px #EDEFF0 inset;
	border-radius: 10px;
	background: #fff;
	width:auto;
	height:auto;
	overflow-y: auto;
	overflow-x: auto;
}
.ztree li a input.rename {height:16px;line-height:16px; width:80px; padding:0; margin:0;
  font-size:12px; border:1px #585956 solid; *border:0px}
</style>
</head>
<body onresize="resizeTree();">
	<div class="container-fluid">
		<div class="row">
			<input type="hidden" id="sysOwner" value="${sysOwner }"/>
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				<div class="col-sm-5 col-md-4 bg-white tree-block" style="width:38.2%;">
					<div>
						<ul id="roleTree" class="ztree"></ul>
					</div>
					<div style="padding-left:20px;">
					<form id="roleForm">
						<div class="group-input">
							<input type="hidden" name="id" id="roleId" /> <input type="hidden" name="parentId" id="parentId" /> 
							<span>角色名：</span><input class="input-style" name="name" id="roleName" required="required"/><br /> 
							<span>角色描述：</span><input class="input-style" name="description" id="roleDesc"/><br /> 
						</div>
					</form>
					</div>
					<div style="padding:10px 0px 0px 25%">
						<input type="button" id="roleSaveBtn" onclick="saveRole();" class="btn btn-def" value="保存">
					</div>
				</div>
				<div class="col-sm-7 col-md-8 bg-white tree-block" style="width:61.8%;margin-left:10px;">
					<div>
						<ul id="menuTree" class="ztree"></ul>
					</div>
					<div style="padding:25px 0px 0px 30%">
						<input type="button" class='btn btn-def' onclick="saveMenu();" value="保存" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		/* 参数 */
		var initRoleNodes = [];
		var delRoleIds = [];
		var removedIds = [];
		var selectedRoleNode;
		
		$(document).ready(function() {
			resizeTree();
			loadRoleTree();
			displayMenuTree("");
		});
		
		function resizeTree(){
			$(".ztree").css("height",($(window).height()-100)*0.618);
			$(".tree-block").css("height",($(window).height()-100));
			$(".tree-block").css("max-width",($(window).width()-200)*0.5);
		};

		var newCount = 1;
		function addHoverDom(treeId, treeNode) {
			if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0){
				return;
			}
			if(treeNode.level>=1|| treeNode.id == 1){
				return;
			}
			var sObj = $("#" + treeNode.tId + "_span");
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加角色' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_" + treeNode.tId);
			if (btn)
				btn.bind("click", function() {
					var zTree = $.fn.zTree.getZTreeObj("roleTree");
					zTree.addNodes(treeNode, {
						id : (100+newCount),
						pId : treeNode.id,
						name : "新角色" + (newCount++),
						isNew : true
					});
					return false;
				});
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_" + treeNode.tId).unbind().remove();
		};
		function setRemoveBtn(treeId, treeNode) {
			return !treeNode.isParent&&treeNode.pId != 1 && isEmpty(treeNode.constantType);
		};
		function setRenameBtn(treeId, treeNode) {
			return !treeNode.isParent&&treeNode.pId != 1&& isEmpty(treeNode.constantType);
		};

		function treeClick(event, treeId, treeNode) {
			selectedRoleNode = treeNode;
			if (treeNode) {
				if (!isEmpty(treeNode.pId) && treeNode.pId != 0) {
					if(isEmpty(treeNode.constantType)){
						$("#roleId").val(treeNode.id);
						$("#roleName").val(treeNode.name);
						$("#roleDesc").val(treeNode.title);
						$("#parentId").val(treeNode.pId);
						$("#roleSaveBtn").attr("class","btn btn-def");
						$("#roleSaveBtn").attr("disabled",false);
						$("#roleName").attr("disabled",false);
						$("#roleDesc").attr("disabled",false);
					}else{
						$("#roleId").val("");
						$("#roleName").val(treeNode.name);
						$("#roleDesc").val(treeNode.title);
						$("#parentId").val("");
						$("#roleSaveBtn").attr("class","btn btn-dis");
						$("#roleSaveBtn").attr("disabled",true);
						$("#roleName").attr("disabled",true);
						$("#roleDesc").attr("disabled",true);
					}
					displayMenuTree(treeNode.id);
				}else{
					$("#roleId").val("");
					$("#roleName").val(treeNode.name);
					$("#roleDesc").val(treeNode.title);
					$("#parentId").val("");
					$("#roleSaveBtn").attr("class","btn btn-dis");
					$("#roleSaveBtn").attr("disabled",true);
					$("#roleName").attr("disabled",true);
					$("#roleDesc").attr("disabled",true);
				}
			}
		}

		function roleTreeOnRemove(event, treeId, treeNode){
			if(!treeNode.isNew){
				//removedIds.push(treeNode.id);
				$.ajax({
					url : ctx + "/system/delRole.shtml",
					type : "post",
					data : "roleId="+treeNode.id,
					dataType : "json",
					loading : true,
					success : function(data) {
						if(data.status==1){
							showTips("删除成功^_^");
							loadRoleTree();
						}else if(data.status==2){
							showWarn("删除失败，该角色正在使用");
							loadRoleTree();
						}
					}
				});
			}
		}
		
		$("#roleName").change(function(){
			if(isEmpty($(this).val())){
				return;
			}
			var treeObj = $.fn.zTree.getZTreeObj("roleTree");
			var nodes = treeObj.getSelectedNodes();
			var node = nodes[0];
			if(node.pId == null || !isEmpty(node.constantType)){
				//固定的角色不能修改
				return;
			}
			nodes[0].name = $(this).val();
			treeObj.updateNode(nodes[0]);
		});
		
		$("#roleDesc").change(function(){
			var treeObj = $.fn.zTree.getZTreeObj("roleTree");
			var nodes = treeObj.getSelectedNodes();
			var node = nodes[0];
			if(node.pId == null || !isEmpty(node.constantType)){
				//固定的角色不能修改
				return;
			}
			nodes[0].title = $(this).val();
			treeObj.updateNode(nodes[0]);
		});
		
		var menuNodes=[];
		function displayMenuTree(roleId){
			var menuTreeSettings = {
				view : {
					selectedMulti : false,
		            showLine : false
				},
				check : {
					enable : true,
					chkboxType : { "Y": "ps", "N": "s" }
				},
				data : {
					key : {
						title : "title" //设置title提示信息对应的属性名称 
					},
					simpleData : {
						enable : true
					}
				},
				edit : {
					enable : false,
				}
			};
			$.ajax({
				url : ctx + "/system/menuList.shtml",
				type : "post",
				data : "roleId="+roleId+"&sysOwner="+$("#sysOwner").val(),
				dataType : "json",
				success : function(items) {
					var needCheck = false;
					if(!isEmpty(roleId)){
						needCheck = true;
						for(var t = 0; t < menuNodes.length; t++){
							menuNodes[t].checked=false;
						}
					}
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if(needCheck){
							for(var t = 0; t < menuNodes.length; t++){
								var tempNode = menuNodes[t];
								if(tempNode.dataId==item.id){
									tempNode.checked=true;
								}
							}
						}else{
							var node = {
								id : item.code,
								pId : item.pCode,
								name : item.name,
								checked : false,
								title : convertEmpty(item.description),
								version : item.version,
								cssName : item.cssName,
								type : item.type,
								dataId : item.id
							};
							menuNodes.push(node);
						}
					}
					$.fn.zTree.init($("#menuTree"), menuTreeSettings, menuNodes);
				}
			});
		}
		
		function loadRoleTree(){
			 // {id : 1,pId : null,name : "管理员",open : true,title : "管理员",isParent : true}, 
			var roleNodes = [ {id : 2,pId : null,name : "医生",open : true,title : "医生",isParent : true}, 
			                  {id : 3,pId : null,name : "护士",open : true,title : "护士",isParent : true},
			                  {id : 4,pId : null,name : "其他",open : true,title : "其他角色",isParent : true}];
			$("#roleForm")[0].reset();
			initRoleNodes = [];
			removedIds = [];
			selectedRoleNode = null;
			var roleTreeSettings = {
				view : {
					addHoverDom : addHoverDom,
					removeHoverDom : removeHoverDom,
					selectedMulti : false,
                    showLine : false
				},
				check : {
					enable : false
				},
				data : {
					key : {
						title : "title" //设置title提示信息对应的属性名称 
					},
					simpleData : {
						enable : true
					}
				},
				edit : {
					enable : true,
					removeTitle : "删除角色",
					renameTitle : "编辑角色名称",
					showRenameBtn : setRenameBtn,
					showRemoveBtn : setRemoveBtn
				},
				callback : {
					onClick : treeClick,
					onRemove: roleTreeOnRemove
				}
			};
			$.ajax({
				url : ctx + "/system/roleList.shtml",
				data:"sysOwner="+$("#sysOwner").val(),
				type : "post",
				dataType : "json",
				success : function(items) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if(item.parentId == 1){
							//管理员不在tree中显示
							continue;
						}
						var node = {
							id : item.id,
							pId : item.parentId,
							name : item.name,
							title : item.description,
							fkTenantId : item.fkTenantId,
							createTime : item.createTime,
							createUserId : item.createUserId,
							constantType : item.constantType,
							isNew : false
						};
						initRoleNodes.push(node);
						roleNodes.push(node);
					}
					$.fn.zTree.init($("#roleTree"), roleTreeSettings, roleNodes);
				}
			});
		}
		

		function saveMenu() {
			if(isEmpty(selectedRoleNode)){
				showWarn("请选择角色");
				return;
			}else if(selectedRoleNode.isNew){
				showWarn("请先保存角色，再选择菜单");
				return;
			}
			if (isEmpty(selectedRoleNode.pId)||selectedRoleNode.pId === 0) {
				showWarn("请选择当前分类的子类");
				return;
			}
			var treeObj = $.fn.zTree.getZTreeObj("menuTree");
			var nodes = treeObj.getCheckedNodes(true);
			if (nodes.length > 0) {
				var checkedMenuIds = [];
				for (var i = 0; i < nodes.length; i++) {
					checkedMenuIds[i]=nodes[i].dataId;
					/* var item = nodes[i];
					var data = {
						id : item.id,
						fkParentId : item.pId,
						name : item.name,
						description : item.title,
						version : item.version,
						cssName : item.cssName,
						type : item.type
					};
					saveData.push(data); */
				}
				$.ajax({
					url : ctx + "/system/saveMenu.shtml",
					type : "post",
					contentType : 'application/json;charset=utf-8',
					data : JSON.stringify({"checkedMenuIds":checkedMenuIds,"menuRoleId":selectedRoleNode.id}),
					dataType : "json",
					loading : true,
					success : function(data) {
						if(data.status==1){
							showTips("保存成功^_^");
						}
					}
				});
			}
		}
		
		function saveRole(){
			var treeObj = $.fn.zTree.getZTreeObj("roleTree");
			var nodes = treeObj.transformToArray(treeObj.getNodes());
			var changedData = [];
			for(var i =0 ;i<nodes.length;i++){
				var node = nodes[i];
				if(node.pId == null || !isEmpty(node.constantType)){
					//固定的角色不能修改
					continue;
				}
				var hasModified = false;
				for(var t=0;t<initRoleNodes.length;t++){
					var initNode = initRoleNodes[t];
					if(initNode.id == node.id){
						if(initNode.name != node.name || initNode.title != node.title){
							hasModified = true;
							break;
						}
					}else{
						if(node.isNew){
							hasModified = true;
							break;
						}
					}
				}
				if(hasModified){
					var data = {
						id : node.isNew ? "" : node.id,
						parentId : node.pId,
						name : node.name,
						description : node.title,
						fkTenantId : node.fkTenantId,
						createTime : node.createTime,
						createUserId : node.createUserId,
						constantType : node.constantType
					};
					changedData.push(data);
				}
			}
			if(changedData.length>0||removedIds.length>0){
				$.ajax({
					url : ctx + "/system/saveRole.shtml",
					type : "post",
					contentType : 'application/json;charset=utf-8',
					data : JSON.stringify({"roles":changedData,"delRoleIds":removedIds,"sysOwner":$("#sysOwner").val()}),
					dataType : "json",
					loading : true,
					success : function(data) {
						if(data.status==1){
							showTips("保存成功^_^");
							loadRoleTree();
						}else if(data.status==2){
							showWarn("删除失败，该角色正在使用");
							loadRoleTree();
						}
					}
				});
			}
		}
	</script>
</body>
</html>