var pagination = {
    addPaging : function(param) {
        var p = {
            bodyId : null,
            loadMoreId : null,
            callback : null,
            scrollEl : null,
            pageSize : 20
        };
        $.extend(p, param);
        if (isEmpty(p.bodyId))
            return false;
        function paging(bodyId, loadMoreId, scrollEl, callback, pageSize) {
            this.bodyId = bodyId;
            this.loadMoreId = loadMoreId;
            this.pageNo = 1;
            this.pageSize = 20;
            this.totalPage = 0;
            this.defaultPageSize = 20;
            this.callback = callback;
            this.scrollEl = scrollEl;
            this.stop = false;
            if (!isEmpty(pageSize)) {
                this.pageSize = pageSize;
                this.defaultPageSize = pageSize;
            }
            if (!isEmpty(scrollEl)) {// bind scroll event
                var page = this;
                $(this.scrollEl).scroll(function() {
                    if ($("#" + page.bodyId).height() <= ($(this).height() + $(this).scrollTop() + 60)) {
                        if (!page.stop) {
                            page.stop = true;// 防止加载次数太多
                            page.loadMore();
                        }
                    }
                });
            }
        }
        paging.prototype = {
            resetPaging : function() {
                this.pageNo = 1;
                this.pageSize = this.defaultPageSize;
                this.totalPage = 0;
                $("#" + this.bodyId).html("");
                if (!isEmpty(this.loadMoreId)) {
                    $("#" + this.loadMoreId).html("加载更多");
                }
            },
            loadMore : function() {
                $("#" + this.loadMoreId).html("加载中...");
                this.callback();
            },
            /** 设置数据加载状态 */
            setTotalPage : function(totalPage) {
                this.totalPage = totalPage;
                var loadMoreId = this.loadMoreId;
                if (this.pageNo == totalPage || totalPage === 0) {
                    this.stop = true;
                    if (!isEmpty(loadMoreId)) {
                        $("#" + loadMoreId).html("已全部加载");
                        $("#" + loadMoreId).off("click");// 解除绑定
                    }
                } else {
                    this.stop = false;
                    this.pageNo = this.pageNo + 1;
                    var page = this;
                    if (!isEmpty(loadMoreId)) {
                        $("#" + loadMoreId).html("加载更多");
                        $("#" + loadMoreId).off("click").on("click", function() {
                            page.loadMore();
                        });
                    }
                }
                this.scroll();
            },
            getPagingData : function() {
                return {
                    pageNo : this.pageNo,
                    pageSize : this.pageSize,
                    totalPage : this.totalPage,
                    str : ("pageNo=" + this.pageNo + "&pageSize=" + this.pageSize + "&totalPage=" + this.totalPage)
                };
            },
            scroll : function() {
                if (!isEmpty(this.scrollEl)) {
                    $(this.scrollEl).scroll();
                }
            }
        };
        var paging = new paging(p.bodyId, p.loadMoreId, p.scrollEl, p.callback, p.pageSize);
        $("#" + p.bodyId).data("pagingobj", paging);
        return paging;
    },
    resetPaging : function(bodyId) {
        var obj = $("#" + bodyId).data("pagingobj");
        obj.resetPaging();
    },
    setTotalPage : function(totalPage, bodyId) {
        var obj = $("#" + bodyId).data("pagingobj");
        obj.setTotalPage(totalPage);
    },
    getPagingData : function(bodyId) {
        var obj = $("#" + bodyId).data("pagingobj");
        return obj.getPagingData();
    },
    scroll : function(bodyId) {
        var obj = $("#" + bodyId).data("pagingobj");
        obj.scroll();
    }
};