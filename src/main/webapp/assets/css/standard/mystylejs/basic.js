/**
 * Created by WT on 2017/6/12.
 */
$(function () {
    // createchart("{b} : {c} ({d}%)");
  //  createchart(false);
    $("#shownum").change(function () {
        if ($(this).is(':checked')) {
            createchart(true, "{b} :{c} ({d}%)");
        } else {
            createchart(false);
        }
    })

    //createchart1(false);
    $("#shownum2").change(function () {
        if ($(this).is(':checked')) {
            createchart1(true, "{b} :{c} ({d}%)");
        } else {
            createchart1(false);
        }
    })

    $("#shownum3").change(function () {
        if ($(this).is(':checked')) {
            createchartline(true);
        } else {
            createchartline(false);
        }
    })
});

function closetip(ev) {
    // $("#" + ev).css("display","none");
    $("#" + ev).hide();
}

