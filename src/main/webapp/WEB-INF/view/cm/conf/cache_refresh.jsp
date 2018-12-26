<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head.jsp"%>
<title>系统缓存刷新</title>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-12 main bg-white" style="padding: 0px;">
				<div class="tab-header">
					<span class="tip-line" style="background: #31AAFF;"></span> <span class="tab-title">缓存列表</span>
				</div>
				<div class="tab-body">
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">用户缓存</span>
						<button class="btn btn-def" data-type="sysUser">刷新</button>
					</div>
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">患者缓存</span>
						<button class="btn btn-def" data-type="patient">刷新</button>
					</div>
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">字典缓存</span>
						<button class="btn btn-def" data-type="dictionary">刷新</button>
					</div>
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">系统参数缓存</span>
						<button class="btn btn-def" data-type="sysParam">刷新</button>
					</div>
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">权限缓存</span>
						<button class="btn btn-def" data-type="permission">刷新</button>
					</div>
					<div class="col-xt-6 m-t-14">
						<span class="f-span-3 u-span min-w-100">公式配置缓存</span>
						<button class="btn btn-def" data-type="formula">刷新</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		$(function() {
			$("button").on("click", function() {
				$.ajax({
					url : ctx + "/cacheRefresh/" + $(this).data("type") + ".shtml",
					//data : "",
					type : "post",
					loading : true,
					dataType : "json",
					success : function(data) {
						if(data.status==1){
							showTips("刷新成功");
						}else{
							showTips("刷新失败，请联系管理员！！！");
						}
					}
				});
			});
		});
	</script>
</body>
</html>