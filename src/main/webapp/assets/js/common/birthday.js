(function($) {
    $.extend({
        ymd_DatePicker : function(options) {
            var defaults = {
                YearSelector : "#sel_year",
                MonthSelector : "#sel_month",
                DaySelector : "#sel_day",
                ResultSelector : null,
                FirstText : "--",
                FirstValue : 0,
                StartDate : "1900-01-01",
                EndDate : "",
                InitDate : null
            };
            var opts = $.extend({}, defaults, options);
            var $YearSelector = $(opts.YearSelector);
            var $MonthSelector = $(opts.MonthSelector);
            var $DaySelector = $(opts.DaySelector);
            var $ResultSelector = null;
            if (opts.ResultSelector != null && opts.ResultSelector != "") {
                $ResultSelector = $(opts.ResultSelector);
            }
            var FirstText = opts.FirstText;
            var FirstValue = opts.FirstValue;

            var StartDate = opts.StartDate + "";
            var EndDate = opts.EndDate + "";

            var InitDate = opts.InitDate;
            if (!isEmpty(InitDate)) {
                if (InitDate.indexOf("-") == -1) {
                    return;
                }
                var tempInitDate = InitDate.split("-");
                $YearSelector.attr("rel", tempInitDate[0]);
                $MonthSelector.attr("rel", tempInitDate[1]);
                $DaySelector.attr("rel", tempInitDate[2]);
                if ($ResultSelector != null) {
                    $ResultSelector.val(InitDate);
                }
            }

            var StartYear = 1900;
            var StartMonth = 1;
            var StartDay = 1;
            // 默认结束日期为今天
            var CurrentDate = new Date();
            var EndYear = CurrentDate.getFullYear();
            var EndMonth = CurrentDate.getMonth() + 1;
            var EndDay = CurrentDate.getDate();
            if (!isEmpty(StartDate) && StartDate.indexOf("-") > -1) {
                var tempStartDate = StartDate.split("-");
                StartYear = parseInt(tempStartDate[0]);
                StartMonth = parseInt(tempStartDate[1]);
                StartDay = parseInt(tempStartDate[2]);
            }
            if (!isEmpty(EndDate) && EndDate.indexOf("-") > -1) {
                var tempEndDate = EndDate.split("-");
                EndYear = parseInt(tempEndDate[0]);
                EndMonth = parseInt(tempEndDate[1]);
                EndDay = parseInt(tempEndDate[2]);
            }

            // 初始化
            var str = "<option value=\"" + FirstValue + "\">" + FirstText + "</option>";
            $YearSelector.html(str);
            $MonthSelector.html(str);
            $DaySelector.html(str);

            // 年份列表
            var yearSel = $YearSelector.attr("rel");
            for (var i = EndYear; i >= StartYear; i--) {
                var sed = yearSel == i ? "selected" : "";
                var yearStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                $YearSelector.append(yearStr);
            }

            BuildMonth();

            // 月份列表
            function BuildMonth() {
                var monthSel = $MonthSelector.attr("rel");
                $MonthSelector.html(str);
                var y = parseInt($YearSelector.val());
                var s = 1;
                var e = 12;
                if (y == StartYear) {
                    s = StartMonth;
                } else if (y == EndYear) {
                    e = EndMonth;
                }
                for (var i = s; i <= e; i++) {
                    var sed = monthSel == i ? "selected" : "";
                    var monthStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                    $MonthSelector.append(monthStr);
                }

            }

            // 日列表(仅当选择了年月)
            function BuildDay() {
                if ($YearSelector.val() == 0) {
                    // 未选择年份
                    $DaySelector.html(str);
                    $MonthSelector.html(str);
                } else if ($MonthSelector.val() == 0) {
                    // 未选择月份
                    $DaySelector.html(str);
                } else {
                    $DaySelector.html(str);
                    var year = parseInt($YearSelector.val());
                    var month = parseInt($MonthSelector.val());
                    var dayCount = 0;
                    switch (month) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        dayCount = 31;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        dayCount = 30;
                        break;
                    case 2:
                        dayCount = 28;
                        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                            dayCount = 29;
                        }
                        break;
                    default:
                        break;
                    }

                    var s = 1;
                    if (year == StartYear && month == StartMonth) {
                        s = StartDay;
                    } else if (year == EndYear && month == EndMonth) {
                        dayCount = EndDay;
                    }

                    var daySel = $DaySelector.attr("rel");
                    for (var i = s; i <= dayCount; i++) {
                        var sed = daySel == i ? "selected" : "";
                        var dayStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                        $DaySelector.append(dayStr);
                    }
                }
            }
            $YearSelector.change(function() {
                $YearSelector.attr("rel", $YearSelector.val());
                BuildMonth();
                BuildDay();
                setResult();
            });
            $MonthSelector.change(function() {
                $MonthSelector.attr("rel", $MonthSelector.val());
                BuildDay();
                setResult();
            });
            $DaySelector.change(function() {
                $DaySelector.attr("rel", $DaySelector.val());
                setResult();
            });
            if ($DaySelector.attr("rel") != "") {
                BuildDay();
            }
            function setResult() {
                if ($ResultSelector != null) {
                    var y = $YearSelector.attr("rel");
                    var str = "";
                    if (!isEmpty(y) && !isNaN(y) && parseInt(y) != 0) {
                        str += y;

                        var m = $MonthSelector.attr("rel");
                        if (!isEmpty(m) && !isNaN(m) && parseInt(m) != 0) {
                            m = parseInt(m);
                            if (0 < m && m < 10) {
                                m = "0" + m;
                            }
                            str += "-" + m;

                            var d = $DaySelector.attr("rel");
                            if (!isEmpty(d) && !isNaN(d) && parseInt(d) != 0) {
                                d = parseInt(d);
                                if (0 < d && d < 10) {
                                    d = "0" + d;
                                }
                                str += "-" + d;
                            }
                        }
                    }

                    $ResultSelector.val(str);
                }
            }
        } // End ymd_DatePicker
    });
})(jQuery);