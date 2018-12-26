<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>    
    <%@ include file="../../common/head_standard.jsp"%>
    <title>药品观察记录</title>    
    <style>
    .u-dialog-footer{
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: calc(100% - 172px);
        margin-left: 172px;
        padding: 0px 16px;
        text-align: center;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        background: white;
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #D9E0E6;
    }
</style>
</head>
<body class="fc-48" style="overflow-y: hidden">    
    <div>
    <form action="#" onsubmit="return false" id="CkdDrugsRecordForm">
    <input type="hidden" name="id" value="${record.id }"/>
    <input type="hidden" name="fkPatientId" value="${record.fkPatientId }"/>
        <div class="u-dialog-content" style="overflow-y:auto " id="mainContent">
            <div class="ml-12 mr-12">
                <div class="u-xt-12">
                    <div class=" st-list-flex">
                        <div class="u-list-text w-179">
                            <span class="left">姓名：</span>
                            <span class="right">${patient.name}</span>
                        </div>
                         <div class="u-list-text w-179">
                            <span class="left">性别：</span>
                            <span class="right">${patient.sexShow }</span>
                        </div>
                         <div class="u-list-text w-179">
                            <span class="left">年龄：</span>
                            <span class="right">${patient.age }</span>
                        </div>
                         <div class="u-list-text w-179">
                            <span class="left">电话号码：</span>
                            <span class="right">${patient.mobile }</span>
                        </div>

                    </div>
                </div>
                <div class="u-xt-12" style="margin-top: -12px">
                    <div class="st-list-flex">
                        <div class="u-list-text w-179">
                            <span class="left">穿刺时间：</span>
                            <span class="right">${createTimeShow }</span>
                        </div>
                        <div class="u-list-text w-179">
                            <span class="left">住院号：</span>
                            <span class="right">${cardNo }</span>
                        </div>
                        <div class="u-list-text w-179">
                            <span class="left">记录人：</span>
                            <span class="right">${record.createUserName}</span>
                        </div>
                        <div class="u-list-text w-179"></div>
                    </div>
                </div>
                <div class="u-xt-12" style="margin-top: -12px">
                    <div class="u-list-text">
                        <span class="left" style="width: 70px;text-align: left">病理诊断：</span>
                        <span class="right">${diagnosisEntity}</span>
                    </div>
                </div>
            </div>
            <div class="ml-12 mr-12 mt-20">
                <div class="u-xt-12">
                <c:forEach items="${drugs_type}" var="item" >
                    <label class="u-radio">
                      <input type="radio" name="drugsType" value="${item.itemCode }" <c:if test="${record.drugsType==item.itemCode }">checked</c:if>>
                      <span class="icon-radio"></span>${item.itemName }
                    </label>
                </c:forEach>
                </div>
                <div class="u-xt-12 mt-8">
                    <div class="st-list-flex">
                        <div class="u-list-text w-285">
                            <span class="left left1">记录日期：</span>
                            <span class="right right1">
                                <input type="text" name="recordDateStr" id="recordDateStr" readonly="readonly" value="${record.recordDateStr }" datepicker>
                            </span>
                        </div>
                        <div class="u-list-text w-285" data-code="drugs_type_1">
                            <span class="left"  style="width: 118px">雷公藤多苷：</span>
                            <span class="right"  style="width:calc(100% - 118px)"><input type="text" name="tripterygiumGlycosides" value="${record.tripterygiumGlycosides }"></span>
                        </div>
                         <div class="u-list-text w-285" data-code="drugs_type_1">
                            <span class="left" style="width: 112px">ACEI/ARB：</span>
                            <span class="right" style="width:calc(100% - 112px)"><input type="text" name="aceiArb" value="${record.aceiArb }"></span>
                        </div>
                        <div class="u-list-text w-285" style="display:none;" data-code="drugs_type_2">
                            <span class="left"  style="width: 118px">甲泼尼龙/泼尼龙：</span>
                            <span class="right"  style="width:calc(100% - 118px)"><input type="text" name="spiltNylon" value="${record.spiltNylon }"></span>
                        </div>
                         <div class="u-list-text w-285" style="display:none;" data-code="drugs_type_2">
                            <span class="left" style="width: 112px">免疫抑制剂：</span>
                            <span class="right" style="width:calc(100% - 112px)"><input type="text" name="immunosuppressant" value="${record.immunosuppressant }"></span>
                        </div>
                    </div>
                </div>
                <div class="u-xt-12">
                    <div class="st-list-flex">
                        <div class="u-list-text w-285">
                            <span class="left left1">蛋白：</span>
                            <span class="right right1"><input type="text" name="protein" value="${record.protein }"></span>
                        </div>
                         <div class="u-list-text w-285">
                            <span class="left"  style="width: 118px">血白：</span>
                            <span class="right"  style="width:calc(100% - 118px)"><input type="text" name="bloodWhite" value="${record.bloodWhite }"></span>
                        </div>
                        <div class="u-list-text w-285">
                            <span class="left" style="width: 112px">24H尿蛋白定量：</span>
                            <span class="right" style="width:calc(100% - 112px)"><input type="text" name="urinaryProteinQuantification" value="${record.urinaryProteinQuantification }"></span>
                        </div>
                    </div>
                </div>
                <div class="u-xt-12">
                    <div class="st-list-flex">
                        <div class="u-list-text w-285">
                            <span class="left left1">血常规：</span>
                            <span class="right right1"><input type="text" name="routineBloodTest" value="${record.routineBloodTest }"></span>
                        </div>
                        <div class="u-list-text w-285">
                            <span class="left"  style="width: 118px">肝功能：</span>
                            <span class="right"  style="width:calc(100% - 118px)"><input type="text" name="liver" value="${record.liver }"></span>
                        </div>
                         <div class="u-list-text w-285">
                            <span class="left" style="width: 112px">肾功能：</span>
                            <span class="right" style="width:calc(100% - 112px)"><input type="text" name="renal" value="${record.renal }"></span>
                        </div>
                    </div>
                </div>
                <div class="u-xt-12">
                    <div class="u-xt-4">
                        <div class="u-list-text">
                            <span class="left text-left-imp" style="width: 85px">下次随访日：</span>
                            <span class="right"><input type="text" name="followDateStr" id="followDateStr" readonly="readonly" value="${record.followDateStr }" datepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
        </form>    
    </div>    
    <script type="text/javascript" src="${ctx }/assets/js/ckd/patient/ckd_drugs_record.js?version=${version}"></script>    
    <script>
        $(function(){
            $("#mainContent").css({"max-height":$(window).height()-120});
            ckd_drugs_record.init();
        })
    </script>
</body>
</html>

