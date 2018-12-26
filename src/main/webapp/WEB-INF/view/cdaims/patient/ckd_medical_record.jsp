<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!-- 用药记录dialog -->
<div class="u-mask" id="ckdMedicalRecordDialog" data-hide="#ckdMedicalRecordDialog">
    <div class="u-dialog">
        <div class="u-dialog-header">
            <div class="pl-12 fw-bold" title1></div>
            <div class="fs-18">用药记录</div>
            <div></div>
        </div>
        <div class="u-dialog-content" style="min-height: 125px;">
            <form action="#" onsubmit="return false;" id="ckdMedicalRecordForm">
                <input type="hidden" name="id" /> 
                <input type="hidden" name="fkPatientId" />
                <div class="contentCenter">
                    <div class="u-list-text">
                        <div class="left">记录时间：</div>
                        <div class="right">
                            <input type="text" name="recordDateStr" id="recordDateStr" readonly="readonly" datepicker required data-msg-required="请选择记录时间">
                        </div>
                    </div>
                    <div class="u-list-text mt-12">
                        <div class="left">用药名称：</div>
                        <div class="right">
                            <input type="text" name="medicalName" placeholder="请输入用药名称">
                        </div>
                    </div>
                    <div class="u-list-text mt-12">
                        <div class="left">剂量：</div>
                        <div class="right">
                            <input type="text" name="dosage" >
                        </div>
                    </div>
                    <div class="u-list-text mt-12">
                        <div class="left">数量：</div>
                        <div class="right">
                            <input type="text" name="ordernum" >
                        </div>
                    </div>
                    <div class="u-list-text mt-12">
                        <div class="left">频次：</div>
                        <div class="right">
                            <input type="text" name="frequencycode" >
                        </div>
                    </div>
                    <div class="u-list-text mt-12">
                        <div class="left">备注：</div>
                        <div class="right">
                            <input type="text" style="height:70px;" name="remark" >
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="u-dialog-footer">
            <button type="button" data-hide="#ckdMedicalRecordDialog">取消</button>
            <button type="button" class="u-btn-blue" onclick="ckd_medical_record.save();" fill>确定</button>
        </div>
    </div>
</div>    
    <script type="text/javascript" src="${ctx }/assets/js/ckd/patient/ckd_medical_record.js?version=${version}"></script>    
    <script>
        $(function(){            
            ckd_medical_record.init();
        })
    </script>
</body>
</html>

