// when login success， set permission data to local storage
if (getCookie("cacheFlag") == "0") {
    $.ajax({
        url : ctx + "/system/getUserPermissionData.shtml",
        type : "post",
        dataType : "json",
        async : false,
        success : function(data) {
            if (data.status == 1) {
                var storage = window.localStorage;
                storage.setItem("user_non_permission_list", convertEmpty(data.user_non_permission));
                storage.setItem("user_permission_list", convertEmpty(data.user_permission));
                setCookie("cacheFlag", "1");
            } else {
                console.log("用户登录信息失效，或登录信息不存在");
            }
        }
    });
}

var permission_cache = {
    /** cache user permission list */
    permission_list : null,
    /** cache user no permission key */
    no_permission : {},
    init : function() {
        var no_permission_list = this.getPermission("user_non_permission_list");
        // cache no perimission data
        if (!isEmptyObject(no_permission_list)) {
            for (var i = 0; i < no_permission_list.length; i++) {
                this.no_permission[no_permission_list[i].key] = false;
            }
        }
    },
    /**
     * 获取权限集合
     * 
     * @param key
     * @returns
     */
    getPermission : function(key) {
        var permissionStr = window.localStorage.getItem(key);
        if (isEmpty(permissionStr)) {
            return new Array();
        }
        return eval('(' + permissionStr + ')');
    },
    /**
     * 获取用户有权限的列表
     */
    getHaveFormCache : function() {
        if (!isEmpty(this.permission_list)) {
            return this.permission_list;
        }
        this.permission_list = this.getPermission("user_permission_list");
        return this.permission_list;
    }
};

// cache init
permission_cache.init();

$(function() {
    /**
     * 根据权限设置按钮显示
     */
    $("[data-permission-key]").each(function() {
        if (hasPermission($(this).attr("data-permission-key"))) {
            $(this).removeClass("hide");
            $(this).show();
        } else {
            $(this).remove();
        }
    });
});

/**
 * 判断是否有权限
 */
function hasPermission(key) {
    return isEmpty(permission_cache.no_permission[key]) ? true : false;
}

/**
 * 通过权限key获取权限对象
 * 
 * @param val
 * @returns权限对象
 */
function getPermissionObjByKey(val) {
    var user_permission_list = permission_cache.getHaveFormCache();
    for (var i = 0; i < user_permission_list.length; i++) {
        if (user_permission_list[i].key == val) {
            return user_permission_list[i];
        }
    }
}
/**
 * 通过权限key获取权限url,如果当前权限不存在url，获取其子节点的第一个url
 * 
 * @param val
 * @returns 权限中的url地址
 */
function getPermissionUrlByKey(val) {
    var user_permission_list = permission_cache.getHaveFormCache();
    var obj = null;
    for (var i = 0; i < user_permission_list.length; i++) {
        if (user_permission_list[i].key == val) {
            obj = user_permission_list[i];
            break;
        }
    }
    if (!isEmptyObject(obj)) {
        if (!isEmpty(obj.url)) {
            if (obj.url.indexOf(",") > -1) {// 如果一个权限对应多个url，默认获取第一个
                var arr = obj.url.split(",");
                return arr[0];
            } else {
                return obj.url;
            }
        } else {
            return getPermissionUrlByParentCode(obj.code);
        }
    }
    return null;
}

/**
 * 通过url获取权限对象
 * 
 * @param val
 * @returns权限对象
 */
function getPermissionObjByUrl(url) {
    var user_permission_list = permission_cache.getHaveFormCache();
    var realUrl = getRelativeUrl(url);
    for (var i = 0; i < user_permission_list.length; i++) {
        if (!isEmpty(user_permission_list[i].url)) {
            var tempUrls = user_permission_list[i].url.split(",");
            for (var t = 0; t < tempUrls.length; t++) {
                if (tempUrls[t] == realUrl) {
                    return user_permission_list[i];
                }
            }
        }
    }
}

/**
 * 通过pCode获取该对象下第一个有权限的url
 * 
 * @param val
 * @returns 第一个有权限的url,如果对应多个url，则返回第一个
 */
function getPermissionUrlByParentCode(code) {
    var obj = getPermissionByParentCode(code);
    if (!isEmptyObject(obj)) {
        if (obj.url.indexOf(",") > -1) {// 如果一个权限对应多个url，默认获取第一个
            var arr = obj.url.split(",");
            return arr[0];
        } else {
            return obj.url;
        }
    }
}

/**
 * 通过pcode获取该对象下所有同级的对象
 * 
 * @param code
 * @returns permission Object[]
 */
function getPermissionSiblingsByPcode(code) {
    var user_permission_list = permission_cache.getHaveFormCache();
    var siblings = [];
    for (var i = 0; i < user_permission_list.length; i++) {
        if (user_permission_list[i].pCode == code) {
            siblings.push(user_permission_list[i]);
        }
    }
    return siblings;
}

/**
 * 通过pCode获取该对象下第一个有权限而且有url的对象
 * 
 * @param val
 * @returns permission Object
 */
function getPermissionByParentCode(code) {
    var user_permission_list = permission_cache.getHaveFormCache();
    for (var i = 0; i < user_permission_list.length; i++) {
        if (user_permission_list[i].pCode == code) {
            if (isEmpty(user_permission_list[i].url)) {
                return getPermissionByParentCode(user_permission_list[i].code);
            } else {
                return user_permission_list[i];
            }
        }
    }
}

/** 根据url获取对应的名称 */
function getUrlNameFormPermission(url) {
    var user_permission_list = permission_cache.getHaveFormCache();
    for (var i = 0; i < user_permission_list.length; i++) {
        var tempUrl = user_permission_list[i].url;
        if (!isEmpty(tempUrl)) {
            tempUrl = tempUrl.split(",");
            for (var t = 0; t < tempUrl.length; t++) {
                if (url == tempUrl[t]) {
                    return user_permission_list[i].name;
                }
            }
        }
    }
    return "";
}

/**
 * 获取患者页面url，根据权限获取第一个，如果有电子病历首页权限，则固定进入电子病历首页
 * 
 * @param patientId
 *            患者ID
 * @returns {string} url
 */
function getPatientPageUrl(patientId) {
    var url = ctx + '/patient/findPatient.shtml?patientId=' + patientId;
    var siblings = getPermissionSiblingsByPcode('11201');
    if (!hasPermission("patient_home")) {
        url = ctx + "/" + siblings[0].url + ".shtml?patientId=" + patientId;
    }
    return url;
}

// 跳转至患者信息页面
function toPatientPage(patientId) {
    if (!isEmpty(patientId)) {
        window.location.href = getPatientPageUrl(patientId);
    }
}
// 跳转至患者信息页面(全屏弹窗)
function toFullScreenPatientPage(patientId, patientName) {
    if (!isEmpty(patientId)) {
        openUrl("patientDS_" + patientId, patientName + "电子病历", getPatientPageUrl(patientId), "callBackRound")
    }
}

/*打开新的tab*/
function openUrl(id, name, url, callBack) {
    if (existsFunction("parent.addTab")) {
        parent.addTab({
            id : id,
            name : name,
            url : url,
            removeCall : callBack
        });
    } else {
        window.location.href = url;
    }
}

/**
 * 返回病程记录页面
 */
function closeFullDialog() {
    removeUrlStackLast();
    $("#topNav").removeClass("hide");
    $("#fullDialog").toggle();
    if (jQuery.isFunction(jQuery.fn.callBackRound)) {
        jQuery(document).callBackRound();
    }
}