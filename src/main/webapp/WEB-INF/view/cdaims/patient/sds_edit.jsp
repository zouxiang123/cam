<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="../../common/head_standard.jsp"></jsp:include>
<title>SDS</title>
</head>
<body>
<form action="#" onsubmit="return false" id="sdsForm">
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
        <div class="bb-dashed pb-8 fw-bold">SDS抑郁自评量表</div>
        <div class="mt-8 fw-bold">01、我觉得闷闷不乐，情绪低沉</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item01" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item01" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">02、我觉得一天之中早晨最好</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item02" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item02" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">03、我一阵阵哭出来或觉得想哭</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item03" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item03" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">04、我晚上睡眠不好</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item04" value="1">  <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item04" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item04" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50">
                 <input type="radio" name="item04" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">05、我吃得跟平常一样多</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item05" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item05" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">06、我与异性密切接触时和以往一样感到愉快</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item06" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item06" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">07、我发觉我的体重在下降</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item07" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item07" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">08、我有便秘的苦恼</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item08" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item08" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">09、我心跳比平时快</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item09" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item09" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">10、我无缘无故的感到疲乏</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item10" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item10" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">11、我的头脑跟平常一样清楚</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item11" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item11" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">12、我觉得经常做的事情并没有困难</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item12" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item12" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">13、我觉得不安而平静不下来</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item13" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item13" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">14、我对将来抱有希望</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item14" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item14" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">15、我比平常容易生气激动</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item15" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item15" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">16、我觉得作出决定是容易的</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item16" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item16" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">17、我觉得自己是个有用的人，有人需要我</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item17" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item17" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">18、我的生活过的很有意思</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item18" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item18" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>

        <div class="fw-bold">19、我认为如果我死了别人会生活得好些</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item19" value="1"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（1分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="2"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="3"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item19" value="4"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（4分）</span>
        </div>

        <div class="fw-bold">20、平常感兴趣的事我仍然照样感兴趣</div>
        <div class="u-xt-12 pb-8 ml-32">
            <label class="u-radio mr-0"> 
                <input type="radio" name="item20" value="4"> <span class="icon-radio"></span>偶尔
            </label> <span class="opacity-5">（4分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="3"> <span class="icon-radio"></span>有时
            </label> <span class="opacity-5">（3分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="2"> <span class="icon-radio"></span>经常
            </label> <span class="opacity-5">（2分）</span> 
            <label class="u-radio mr-0 ml-50"> 
                <input type="radio" name="item20" value="1"> <span class="icon-radio"></span>持续
            </label> <span class="opacity-5">（1分）</span>
        </div>
        <div class="mt-8 bt-dashed">
            <span class="fw-bold">抑郁自评量表(SDS)评分结果：</span> 
            <span class="fc-red fs-24" id="scoreSpan"></span> 
            <span class="opacity-5">分</span>
        </div>
        <div class="opacity-5  mb-16">按照中国常模结果，SDS标准分的分界值为53分，其中53—62分为轻度抑郁，63—72分为中度抑郁，72分以上为重度抑郁。</div>
    </div>
</div>
</form>
<script type="text/javascript" src="${ctx }/assets/js/ckd/patient/sds_edit.js?version=${version}"></script>
</body>
</html>