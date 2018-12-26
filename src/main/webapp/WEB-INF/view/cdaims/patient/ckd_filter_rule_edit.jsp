<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<style>
  *{
    color: #484848;
  }
  .u-menu > div:first-child > span > a {
    max-width: 100px;
  }
  .u-table-fixed-body td{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .static-head-er1 > ul > li{
    margin-left: 32px;
    padding-left: 0;
  }
</style>
<!-- 新增弹框 -->
    <div class="u-mask" id="ckdFilterRuleEditDialog" data-hide="#ckdFilterRuleEditDialog">
        <div class="u-dialog" style="width: 600px">
          <div class="u-dialog-header">
            <div></div>
            <div>编辑</div>
            <div></div>
          </div>
          <div class="u-dialog-content">
          <div class="u-xt-12">
              <div class="m-auto" style="width: 45%" id="scRule">
                 <label class="u-radio u-float-l">
                  <input type="radio" name="ra" data-code="1" checked>
                  <span class="icon-radio"></span>诊断名筛查
                </label>

                <label class="u-radio u-float-r">
                  <input type="radio" name="ra" data-code="2" >
                  <span class="icon-radio"></span>化验项筛查
                </label>
              </div>
            </div>
          <form action="#" id="ckdFilterRuleForm" onsubmit="return false;">
                <input type="hidden" name="id" />            
            <div class="u-xt-12 mt-16 pl-16">
                <span>筛查规则名：</span>
                <input type="text" name="suspectedDiagnosticName" style="width: 280px">
              </div>
            <!-- 诊断名筛查 -->
            <div class="u-xt-12 mt-16 pl-16">              
               <div class="u-xt-12 mt-12">
                <span>确诊诊断名：</span>
                <label class="u-prompt-text icon-input" id="patientDiv">
                    <input type="text" name="confirmedDiagnosisName" id="confirmedDiagnosisNameSearch" placeholder="确诊诊断名" style="width: 280px" value="" >
                    <input type="hidden" name="confirmedDiagnosisCode" id="confirmedDiagnosisCode">
                    <ul hidden id="confirmedDiagnosisNameList"></ul>
                </label>
              </div>
            </div>
            <!-- 诊断名筛查 -->            
            </form>
            <form action="#" id="ckdFilterRuleForm1" onsubmit="return false;">
                <input type="hidden" name="id" />            
            <div class="u-xt-12 mt-16 pl-16">
                <span>筛查规则名：</span>
                <input type="text" name="suspectedDiagnosticName" style="width: 280px">
              </div>            
            <!-- 化验项筛查 -->                     
            <div id="check_div"></div>
            <div class="hyRule u-display pl-16">
                <div class="u-xt-12 mt-16">
                    <span id="addMe" class="u-btn-blue ml-12 hand" text>添加</span><span class="u-btn-red ml-12 hand" id="del" text>删除</span>
                </div>
            </div>                     
            <!-- 化验项筛查 -->
            </form>
          </div>
          <div class="u-dialog-footer">
            <button type="button" data-hide="#ckdFilterRuleEditDialog">取消</button>
            <button type="button" class="u-btn-blue" onclick="ckd_filter_rule_edit.save();" fill>确定</button>
          </div>
        </div>
    </div>

    <!-- 新增弹框 -->
<script type="text/javascript">
$(function() {   
    $("#scRule input[type='radio']").change(function(){       
        if($(this).is(":checked")&&$(this).parent().text().indexOf("诊断名筛查")!="-1"){            
          $("#ckdFilterRuleForm").show();
          $("#ckdFilterRuleForm1").hide();          
        }else if ($(this).is(":checked")&&$(this).parent().text().indexOf("化验项筛查")!="-1") {            
           $("#ckdFilterRuleForm").hide();
          $("#ckdFilterRuleForm1").show();          
        }
      })
    ckd_filter_rule_edit.init()
});

var ckd_filter_rule_edit = {
    saveCall : null,
    assaylist: null,
    init : function() {       
        this.addValidate();        
        this.addEvents(); 
        this.getInitConfirmedDiagnosisNames();
        this.initAssayNames();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        //添加
        $("#addMe").on("click",function(){            
            var index=0;
            var curIndex=$("#check_div .hyRule").last().attr("data-index");
            if(!isEmpty(curIndex)){
                index=parseInt(curIndex)+1;
            }
            var html='<div class="hyRule u-display pl-16" data-index="'+index+'">';
            html+='<div class="u-xt-12 mt-12">';
            html+='<span>化验项名称：</span>';
            html+='<label class="u-prompt-text icon-input">';
            html+='<input type="text" name="ckdFilterValues['+index+'].itemName" id="assayNameSearch'+index+'" placeholder="化验项名称" style="width: 150px" value="" >';
            html+='<input type="hidden" name="ckdFilterValues['+index+'].itemCode" id="itemCode'+index+'">';
            html+='<ul hidden id="assayNameList'+index+'"></ul></label>';                                         
            html+='<span>条件：</span>';
            html+='<label class="u-select mr-14">'
            html+='<select name="ckdFilterValues['+index+'].itemFilter" style="width:78px">';           
            html+='<option value=">">></option>';
            html+='<option value=">=">>=</option>';
            html+='<option value="=">=</option>';
            html+='<option value="<"><</option>';
            html+='<option value="<="><=</option>';
            html+='</select></label>';
            html+='<span>结果：</span><input type="text" class="w-90-imp" name="ckdFilterValues['+index+'].itemValue"/>'               
            html+='</div></div>';
            
            $("#check_div").append(html);
            ckd_filter_rule_edit.getAssayNamesHtml(index);
        });
        //删除
         $("#del").on("click",function(){ 
             $("#check_div div").last().remove();
         });
        
         // 点击确诊诊断名搜索输入框
         $("#confirmedDiagnosisNameSearch").click(function(e) {
             e.stopPropagation();
             $(this).siblings("ul").show();
         });
         // 点击患者事件
         $("#confirmedDiagnosisNameList").on("click", "li", function(e) {            
             $('#confirmedDiagnosisCode').val($(this).attr("data-patient-name"));             
             $('#confirmedDiagnosisNameSearch').val($(this).find("span").html());             
             e.preventDefault();
         });  
         
        //点击化验项名称搜索输入框 
         $("form").on("click", "[id^=assayNameSearch]", function(e) {
             e.stopPropagation();
             $(this).siblings("ul").show();
         })
        // 点击化验项事件
         $("form").on("click", "[id^=assayNameList] li", function(e) {             
             var index=$(this).parent().parent().parent().parent().data("index");             
             $('#itemCode'+index).val($(this).attr("data-patient-name"));
             $('#assayNameSearch'+index).val($(this).find("span").html());
             e.preventDefault();
         });
        
         $("body").click(function(e) {             
             $('#confirmedDiagnosisNameList').hide();
             $('form [id^=assayNameList]').hide();
         });
    },
    show : function(id,saveCall) {       
        //重置表单
        $("#ckdFilterRuleForm")[0].reset();
        $("#ckdFilterRuleForm1")[0].reset();
        ckd_filter_rule_edit.saveCall=saveCall;
        $.ajax({
            url : ctx + "/ckdFilterRule/getById.shtml",
            type : "post",
            data : {
                id : id
            },
            dataType : "json",
            loading : true,
            success : function(data) {                
                if(data.status == "1"){  
                    popDialog("#ckdFilterRuleEditDialog");
                    $("input[name='id']").val(data.rs.id);                    
                    //初始化筛查条件二                                                          
                    ckd_filter_rule_edit.getInitData(data.rs.ckdFilterValues);                    
                    var item=data.rs;
                    if(item.id !=null){//编辑  
                        if(!isEmpty(item.confirmedDiagnosisName)){//显示诊断名筛查
                            $("#scRule input[type='radio']").first().prop("checked",true);
                            $("#scRule input[type='radio']").last().prop("checked",false);
                            $("#scRule input[type='radio']").trigger("change");
                            //筛查规则名
                            $("#ckdFilterRuleForm input[name='suspectedDiagnosticName']").val(item.suspectedDiagnosticName);
                            //确诊诊断名
                            $("#confirmedDiagnosisNameSearch").val(item.confirmedDiagnosisName);
                        }else{
                            $("#scRule input[type='radio']").first().prop("checked",false);
                            $("#scRule input[type='radio']").last().prop("checked",true);
                            $("#scRule input[type='radio']").trigger("change");
                            //筛查规则名
                            $("#ckdFilterRuleForm1 input[name='suspectedDiagnosticName']").val(item.suspectedDiagnosticName);                            
                        }
                    }else{//默认显示
                        $("#scRule input[type='radio']").first().prop("checked",true);
                        $("#scRule input[type='radio']").last().prop("checked",false);
                        $("#scRule input[type='radio']").trigger("change");
                    }
                } else {
                  showWarn(data.errmsg);  
                }
                
            }
        });
    },
    save:function(){
        var code=$("#scRule input[type='radio']:checked").attr("data-code");
        var data=$("#ckdFilterRuleForm").serialize();
        var flag=false;        
        if(code=="1"){            
            data=$("#ckdFilterRuleForm").serialize();
            if ($("#ckdFilterRuleForm").valid()) {
                flag=true;
            }
        }else{            
            data=$("#ckdFilterRuleForm1").serialize();
            if ($("#ckdFilterRuleForm1").valid()) {
                flag=true;
            }
        }
        if(flag){
            $.ajax({
                url : ctx + "/ckdFilterRule/save.shtml",
                type : "post",
                data : data,
                dataType : "json",
                loading : true,
                success : function(data) {                
                    if(data.status == "1"){  
                        showTips("保存成功");
                        hiddenMe("#ckdFilterRuleEditDialog");
                        if (!isEmpty(ckd_filter_rule_edit.saveCall)) {
                            ckd_filter_rule_edit.saveCall();
                        }  
                    }
                    
                }
            });  
        }        
    },    
    addValidate : function() {
        $("#ckdFilterRuleForm").validate({
            // 校验字段
            rules : {
                suspectedDiagnosticName : {
                    required : [ "筛查规则名" ]
                }
            }
        });
        
        $("#ckdFilterRuleForm1").validate({
            // 校验字段
            rules : {
                suspectedDiagnosticName : {
                    required : [ "筛查规则名" ]
                }
            }
        });
    },
    getOption :function(item,i){        
        var html='<label class="u-select mr-14">'
            html+='<select name="ckdFilterValues['+i+'].itemFilter" style="width:78px">';           
            
            html+='<option value=">" ';
            if(item.itemFilter==">"){
                html+='selected'; 
            }                            
            html+='>></option>';
            
            html+='<option value=">="';
            if(item.itemFilter==">="){
                html+='selected'; 
            } 
            html+='>>=</option>';
            
            html+='<option value="="';
            if(item.itemFilter=="="){
                html+='selected'; 
            } 
            html+='>=</option>';
            
            html+='<option value="<"';
            if(item.itemFilter=="<"){
                html+='selected'; 
            } 
            html+='><</option>';
            
            html+='<option value="<="';
            if(item.itemFilter=="<="){
                html+='selected'; 
            } 
            html+='><=</option>';
            html+='</select></label>';
            return html;
    },
    getInitData :function(ckdFilterValues){ 
        var html="";
        if(ckdFilterValues!=null){            
            for(var i=0;i<ckdFilterValues.length;i++){                            
                html+='<div class="hyRule u-display pl-16" data-index="'+i+'">';
                html+='<div class="u-xt-12 mt-16">';
                html+='<span>化验项名称：</span>';
                html+='<label class="u-prompt-text icon-input">';
                html+='<input type="text" name="ckdFilterValues['+i+'].itemName" id="assayNameSearch'+i+'" placeholder="化验项名称" style="width: 150px" value="'+ckdFilterValues[i].itemName+'" >';
                html+='<input type="hidden" name="ckdFilterValues['+i+'].itemCode" id="itemCode'+i+'" value="'+ckdFilterValues[i].itemCode+'">';
                html+='<ul hidden id="assayNameList'+i+'"></ul></label>';                                                       
                html+='<span ml-8>条件：</span>';
                html+=ckd_filter_rule_edit.getOption(ckdFilterValues[i],i);               
                html+='<span ml-8>结果：</span><input type="text" class="w-90-imp" name="ckdFilterValues['+i+'].itemValue" value="'+ckdFilterValues[i].itemValue+'"/>'               
                html+='</div></div>';                
            }
            $("#check_div").html(html);
            for(var i=0;i<ckdFilterValues.length;i++){
                ckd_filter_rule_edit.getAssayNamesHtml(i);
            }            
        }else{
            html+='<div class="hyRule u-display pl-16" data-index="0">';
            html+='<div class="u-xt-12 mt-16">';
            html+='<span>化验项名称：</span>';
            html+='<label class="u-prompt-text icon-input">';
            html+='<input type="text" name="ckdFilterValues[0].itemName" id="assayNameSearch0" placeholder="化验项名称" style="width: 150px" value="" >';
            html+='<input type="hidden" name="ckdFilterValues[0].itemCode" id="itemCode0">';
            html+='<ul hidden id="assayNameList0"></ul></label>';
            html+='<span ml-8>条件：</span>';
            html+='<label class="u-select mr-14">'
            html+='<select name="ckdFilterValues[0].itemFilter" style="width:78px">';           
            html+='<option value=">">></option>';
            html+='<option value=">=">>=</option>';
            html+='<option value="=">=</option>';
            html+='<option value="<"><</option>';
            html+='<option value="<="><=</option>';
            html+='</select></label>';
            html+='<span ml-8>结果：</span><input type="text" class="w-90-imp" name="ckdFilterValues[0].itemValue"/>'              
            html+='</div></div>';
            $("#check_div").html(html);
            ckd_filter_rule_edit.getAssayNamesHtml("0");
        }   
                
    },    
    //确诊诊断名初始化查询
    getInitConfirmedDiagnosisNames : function(){        
        var itemCode=$('#confirmedDiagnosisCode').val();             
        var itemName=$('#confirmedDiagnosisNameSearch').val(); 
        itemName=isEmpty(itemName)?"肾":itemName;
        $.ajax({
            url : ctx + "/dict/icd/list.shtml",
            type : "post",
            data :"itemName="+itemName ,
            dataType : "json",
            loading : false,
            success : function(obj) {
                var item = obj.rs;
                var html = '';
                for ( var i in item) {
                    html += '<li data-patient-id="' + item[i].id + '" data-patient-name="' + item[i].itemCode + '">';
                    html += '<span class="text-ellipsis" style="width:155px">' + item[i].itemName + '</span>';
                    html += '</li>';
                }
                $('#confirmedDiagnosisNameList').html(html);
                // 注册患者检索事件
                $('#confirmedDiagnosisNameSearch').fastLiveFilter('#confirmedDiagnosisNameList');
            }
        });
    },
    //化验项名称初始化查询
    initAssayNames : function(){          
        $.ajax({
            url : ctx + "/assay/hospDict/getAssayList.shtml",
            type : "post",            
            dataType : "json",
            loading : false,
            success : function(obj) {                
                var item = obj.items;
                ckd_filter_rule_edit.assaylist=obj.items;                
            }
        });
    },
    //化验数据
    getAssayNamesHtml : function(index){        
            var item= ckd_filter_rule_edit.assaylist;
            var html = '';
            for ( var i in item) {                    
                html += '<li data-patient-id="' + item[i].id + '" data-patient-name="' + item[i].itemCode + '">';
                html += '<span class="text-ellipsis" style="width:155px">' + item[i].itemName + '</span>';
                html += '</li>';
            }           
            $('#assayNameList'+index).html(html);
            // 注册患者检索事件
            $('#assayNameSearch'+index).fastLiveFilter('#assayNameList'+index);        
    },
}
</script>