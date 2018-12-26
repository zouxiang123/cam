var propOrderBy = {};
// 更换顺序
propOrderBy.changeOrderBy = function(changeObj, parent, itemId) {
    // 源
    var originOrder = $(changeObj).attr('item-data');
    // 目标
    var targetOrder = $(changeObj).val();
    var allContentArray = [];
    $(parent).find('[item-id="' + itemId + '"]').each(function() {
        allContentArray.push($(this).clone(true));
    });
    // 进行交换的项
    var changeObj = allContentArray[originOrder];
    // 数组中移除 源 数据
    allContentArray.splice(originOrder, 1);
    // 插入项
    allContentArray.splice(targetOrder, 0, changeObj);
    // 移除需要排序的项
    $(parent).find('[item-id="' + itemId + '"]').remove();
    // 移除放在最底部的内容项
    var addContent = $(parent).find('.add-content');
    addContent.remove();
    // 循环设置 下拉框的内容
    for ( var i in allContentArray) {
        var $sel = $(allContentArray[i]).find('select[item-id="select"]');
        $sel.attr('item-data', i);
        $sel.find('option[value="' + i + '"]').prop('selected', true);
        $(parent).append(allContentArray[i]);
    }
    $(parent).append(addContent);
}
// 计划onchange事件
propOrderBy.planChange = function(obj) {
    propOrderBy.changeOrderBy(obj, '#paln_content', 'unexpertly_list');
}
// 模板onchange事件
propOrderBy.templateChange = function(obj) {
    propOrderBy.changeOrderBy(obj, '#paln_content', 'unexpertly_list');
}
