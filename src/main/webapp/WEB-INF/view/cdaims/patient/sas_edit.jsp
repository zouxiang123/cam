<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="../../common/head_standard.jsp"></jsp:include>
<title>SAS</title>
</head>
<body>
<form action="#" onsubmit="return false" id="sasForm">
    <input type="hidden" name="id" value="${id }"/>
    <input type="hidden" name="fkPatientId" value="${patientId }"/>
    <input type="hidden" name="score"/>
<div style="overflow-x:hidden">
    <div class="border-gray pl-20 pr-20 pt-6">
        <div class="bb-dashed pb-8 fw-bold">评估时间</div>
        <div class="u-xt-12 pt-8 pb-8">
            <div class="u-xt-6">
                <div class="u-list-text">
                    <div class="left">本次时间：</div>
                    <div class="right">
                        <input type="text" name="recordDateShow" id="recordDateInput" readonly="readonly">
                    </div>
                </div>
            </div>
            <div class="u-xt-6">
                <div class="u-list-text">
                    <div class="left">下次时间：</div>
                    <div class="right">
                        <input type="text" name="nextDateShow" id="nextDateInput" readonly="readonly">
                    </div>
                </div>
            </div>
            <div data-error></div>
        </div>
    </div>
    <div class="border-gray pl-20 pr-20 pt-6 mt-10">
        <div class="bb-dashed pb-8 fw-bold">焦虑自评量表</div>
        <div class="mt-8 fw-bold">01、我觉得比平常容易紧张和着急（焦虑）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item01" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">02、我无缘无故地感到害怕（害怕）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item02" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">03、我容易心里烦乱或觉得惊恐（惊恐）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item03" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">04、我觉得我可能将要发疯（发疯感）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item04" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item04" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item04" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item04" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">05、我觉得一切都很好，也不会发生什么不幸（不幸预感）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item05" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">06、我手脚发抖打颤（手足颤抖）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item06" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">07、我因为头痛，颈痛和背痛而苦恼（躯体疼痛）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item07" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">08、我感觉容易衰弱和疲乏（乏力）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item08" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">09、我觉得心平气和，并且容易安静坐着（静坐不能）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item09" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">10、我觉得心跳很快（心慌）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item10" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">11、我因为一阵阵头晕而苦恼（头昏）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item11" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">12、我有晕倒发作或觉得要晕倒似的（晕厥感）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item12" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">13、我呼气吸气都感到很容易（呼吸困维）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item13" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">14、我手脚麻木和刺痛（手足刺痛）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item14" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">15、我因为胃痛和消化不良而苦恼（胃痛或消化不良）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item15" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">16、我常常要小便（尿意频数）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item16" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">17、我的手常常是干燥温暖的（多汗）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item17" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">18、我脸红发热（面部潮红）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item18" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">19、我容易入睡并且一夜睡得很好（睡眠障碍）</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item19" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">20、我做恶梦</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item20" value="1"> <span class="icon-radio"></span>没有或很少时间有
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="2"> <span class="icon-radio"></span>有时有
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="3"> <span class="icon-radio"></span>大部分时间有
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="4"> <span class="icon-radio"></span>绝大部分或全部时间都有
            </label> <span class="opacity-5">（4分）</span>
        </div>
        <div class="mt-8 bt-dashed">
            <span class="fw-bold">焦虑自评量表评分(SAS)结果：</span> 
            <span class="fc-red fs-24" id="scoreSpan"></span> 
            <span class="opacity-5">分</span>
        </div>
        <div class="opacity-5  mb-16">按照中国常模结果，SAS标准分的分界值为50分，其中50—59分为轻度焦虑，60—69分为中度焦虑，70分以上为重度焦虑。</div>
    </div>
</div>
</form>
<script type="text/javascript" src="${ctx }/assets/js/ckd/patient/sas_edit.js?version=${version}"></script>
</body>
</html>