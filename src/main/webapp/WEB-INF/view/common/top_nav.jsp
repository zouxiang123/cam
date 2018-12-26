<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>

<nav class="navbar navbar-fixed-top" data-iframe="false" style="display:none">
	<div class="container-fluid">
		<div id="navbar" class="navbar-collapse">
			<ul class="nav navbar-nav">
				<li><div class="home-page">
						<a href="${ ctx}/home.shtml"><img src="${ctx }/assets/img/home-page.png" /></a>
					</div></li>
				<li>
					<ol class="breadcrumb" id="breadcrumb">
					</ol>
				</li>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<c:if test="${pageContext.request.requestURL.indexOf('home.jsp') == -1 && pageContext.request.requestURL.indexOf('search.jsp') == -1 }">
					<li><img src="${ctx }/assets/img/bing.png" class="nav-search-input-bing"><input type="search" id="topSearchName" name="name"
						class="nav-search-input" placeholder="患者/医生/护士" />
						</li>
				</c:if>
				<li class="nav-user-name dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
					aria-expanded="false" style="width: 159px;"> <span class="user-name">${login_user.name }</span> <img id="nav-user-photo" class="nav-user-photo"
						src="${ctx}/images${login_user.imagePath }">
				</a>
					<ul class="dropdown-menu">
						<li><a href="${ctx }/system/accountSetting.shtml" class="account-setting">账号设置</a></li>
						<li><a href="${ctx  }/about.shtml" class="nav-about">关于我们</a></li>
						<li><a href="${ctx }/feedback.shtml" class="feedback">意见反馈</a></li>
						<li><a href="#" onclick="logout();" class="log-out">退出系统</a></li>
					</ul></li>
			</ul>
		</div>
	</div>
</nav>
<script type="text/javascript">
	function logout(){
		var storage = window.sessionStorage;
		storage.removeItem("homeNotified");
		storage.removeItem("urlStack");
		window.location.href=ctx+"/logout.shtml";
	}
</script>