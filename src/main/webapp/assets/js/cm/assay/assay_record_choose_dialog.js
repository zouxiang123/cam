var assay_record_choose_dialog = {
    callback : null,
    /**
     * 显示dialog
     * 
     * @param patientId
     * @param dictCode
     * @param dateStr
     * @param title
     * @param callback
     */
    show : function(patientId, dictCode, dateStr, title, callback, diaAbFlag) {
        this.callback = callback;
        $("#assayRecordChooseDialog").find("[title]").text(title);
        $.ajax({
            url : ctx + "/assay/patientAssayRecord/listLatestByDictCode.shtml",
            data : {
                patientId : patientId,
                dictCode : dictCode,
                dateStr : dateStr,
                diaAbFlag : convertEmpty(diaAbFlag)
            },
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {// 显示新增dialog
                    var items = data.rs;
                    var html = "";
                    if (!isEmptyObject(items)) {
                        var needDateFlag = true;// 需要生成评估时间行数据
                        var dateInt = parseInt(dateStr.replace(/-/g, ""));
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var assayDateStr = new Date(item.assayDate).pattern("yyyy-MM-dd");
                            var itemDateStr = new Date(item.assayDate).pattern("yyyy-MM-dd");
                            var itemDateInt = parseInt(itemDateStr.replace(/-/g, ""));
                            if (needDateFlag && (itemDateInt < dateInt)) {// 如果当前值小于dateStr，显示时间行
                                html += '<div class="u-xt-12 pt-12 pb-12 bb-dashed ' + (i > 0 ? "bt-dashed mt-8" : "") + ' text-center">';
                                html += '<span>评估时间：' + dateStr + '</span>';
                                html += '</div>';
                                needDateFlag = false;
                            }
                            html += '<div class="u-xt-12 mt-6">';
                            html += '  <div class="u-xt-4">';
                            html += '    <label class="u-radio">';
                            html += '      <input type="radio" name="itemValue" value="' + convertEmpty(item.resultActual) + '" data-date="'
                                            + assayDateStr + '">';
                            html += '      <span class="icon-radio"></span>' + assayDateStr;
                            html += '    </label>';
                            html += '  </div>';
                            html += ' <div class="u-xt-3"><span class="line-height-30">' + convertEmpty(item.resultActual) + '</span></div>';
                            var tipsClass = "";
                            if (item.resultTips == "3") {// 偏高
                                tipsClass = 'icon-upward';
                            } else if (item.resultTips == "4") {// 偏低
                                tipsClass = 'icon-upward';
                            }
                            html += ' <div class="u-xt-2"><span class="' + tipsClass + ' fs-18 line-height-30" style="color: #ff6793"></span></div>';
                            html += ' <div class="u-xt-3"><span class="line-height-30">'
                                            + convertEmpty(item.reference).replace(new RegExp("<", 'gm'), "&lt;") + '</span></div>';
                            html += '</div>';
                            if (needDateFlag && i == items.length - 1) {// 如果是最后一行，且尚未生成评估时间
                                html += '<div class="u-xt-12 pt-12 pb-12 mt-8 bt-dashed bb-dashed text-center">';
                                html += '<span>评估时间：' + dateStr + '</span>';
                                html += '</div>';
                            }
                        }
                    }
                    $("#assayRecordChooseDialogContent").html(html);
                    popDialog("#assayRecordChooseDialog");
                }
            }
        });
    },
    /**
     * 确定
     */
    ensure : function() {
        var checkedEl = $("#assayRecordChooseDialogContent").find("input[name='itemValue']:checked");
        if (checkedEl.length > 0) {
            var date = checkedEl.data("date");
            var val = checkedEl.val();
            if (!isEmpty(this.callback)) {
                this.callback(date, val);
            }
            hiddenMe("#assayRecordChooseDialog");
        } else {
            return false;
        }
    }
};