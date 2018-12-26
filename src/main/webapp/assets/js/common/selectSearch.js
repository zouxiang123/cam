(function($) {
    /** 用于存放待查询的集合 */
    var results = [];
    /** 用于存放当前元素 */
    var _selfs = [];

    $.fn.extend({
        /**
         * 初始化下拉查询。初始化数据有两种方式，第一种通过初始化的时候直接传递参数。第二种是通过获取select的option元素
         */
        initSelectSearch : function(data) {
            data = data || {};
            // console.log("init select search, id:" + $(this).attr("id"));

            var spanId = "selectSearch_" + randomNum(6);// 产生6位随机数
            _selfs[spanId] = this;
            results[spanId] = data.list || [];
            if (results[spanId].length == 0) {
                var paraList = [];
                $(_selfs[spanId]).find("option").each(function() {
                    var paraEntity = {};
                    paraEntity.text = $(this).text();
                    paraEntity.searchContent = convertEmpty($(this).attr("data-search-content"));
                    paraEntity.floatRightContent = convertEmpty($(this).attr("data-float-right-content"));
                    paraEntity.key = $(this).val();
                    paraList.push(paraEntity);
                });
                results[spanId] = paraList;
            }

            resource.hide(spanId);

            target.init(spanId);
        },

        refreshSelectSearch : function() {
            var spanId = $(this).next(".icon-select").attr("id");
            target.refresh(spanId);
        }
    });

    var resource = {
        hide : function(spanId) {
            $(_selfs[spanId]).hide();
        }
    };

    var target = {
        init : function(spanId) {
            var html = '';
            html += '<span class="icon-select" id="' + spanId + '" style="line-height: 36px;padding-left: 5px"></span>';
            html += '<div class="div-search" id="' + spanId + '_floatDiv" style="display: none;">';
            html += '  <label class="icon-input">';
            html += '    <input type="text" placeholder="搜索患者" value="" id="' + spanId + '_input">';
            html += '  </label>';
            html += '  <ul id="' + spanId + '_list" style="max-height: 100px;overflow: auto;">';

            var paraList = results[spanId];
            for ( var i in paraList) {
                var paraEntity = paraList[i];
                html += '    <li data-key="' + paraEntity.key + '">';
                html += '      <span data-text>' + paraEntity.text + '</span>';
                html += '      <span style="display: none">' + paraEntity.searchContent + '</span>';
                if (!isEmpty(paraEntity.floatRightContent)) {
                    html += '      <span class="u-float-r mt-8 ml-2">' + paraEntity.floatRightContent + '</span>';
                }
                html += '    </li>';
            }

            html += '  </ul>';
            html += '</div>';
            $(_selfs[spanId]).after(html);

            $("#" + spanId + "_input").fastLiveFilter("#" + spanId + "_list");// 注册患者检索事件
            target.onEvent(spanId);
        },

        onEvent : function(spanId) {
            var idQuery = "#" + spanId;
            /** 点击出现下拉，默认显示所有li */
            $(idQuery).on("click", function(e) {
                $(idQuery + "_input").val("");
                $(idQuery + "_list > li").show();
                $(idQuery + "_floatDiv").toggle();
                e.stopPropagation();
            });

            /** 点击搜索输入框 */
            $(idQuery + "_input").on("click", function(e) {
                e.stopPropagation();
                $(this).siblings("ul").show();
            });

            /** 选中li */
            $(idQuery + "_list > li").on("click", function(e) {
                var key = $(this).attr("data-key");
                var text = $(this).find("[data-text]").text();

                $(_selfs[spanId]).val(key);
                $(idQuery).text(text);
            });

            /** 浮动层消失 */
            $("body").on("click", function(e) {
                $(idQuery + "_floatDiv").hide();
            });
        },

        clear : function(spanId) {
            var idQuery = "#" + spanId;
            $(idQuery + "_input").val("");
            $(idQuery).text("");
            $(_selfs[spanId]).val("");
        },

        refresh : function(spanId) {
            var idQuery = "#" + spanId;
            $(idQuery + "_input").val("");
            var key = $(_selfs[spanId]).val();
            $(idQuery).text($(_selfs[spanId]).find("option:selected").text());
        }
    };
})(jQuery);

function randomNum(n) {
    var t = '';
    for (var i = 0; i < n; i++) {
        t += Math.floor(Math.random() * 10);
    }
    return t;
}
