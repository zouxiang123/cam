$(function() {
  var topLevels = [];
  topLevels.push("home");
  topLevels.push("index");
  // 同级页面url列表
  var siblingUrls = [];
  var nowUrl = window.location.href;
  var realUrl = getRelativeUrl(nowUrl);

  var storage = window.sessionStorage;
  for (var i = 0; i < topLevels.length; i++) {
    if (realUrl == topLevels[i]) { // 当是顶层页面是直接清空
      storage.removeItem('urlStack');
    }
  }
  var urlStack = storage.getItem('urlStack');
  if (isEmpty(urlStack)) { // 当栈不存在时
    urlStack = [];
  } else {
    urlStack = eval('(' + urlStack + ')');
  }
  var urlExist = false;

  var tempStack = [];
  for (var i = 0; i < urlStack.length; i++) {
    tempStack[i] = urlStack[i];
    if (!isEmpty(urlStack[i].url)) {
      var tempUrl = getRelativeUrl(urlStack[i].url);
      if (realUrl == tempUrl) {
        urlExist = true;
        break;
      }
    }
  }
  urlStack = tempStack;
  if (!urlExist) { // 不存在时
    var isSibling = false; // 是否是同级元素标记
    var currentSiblingsUrls;
    for (var i = 0; i < siblingUrls.length; i++) { // 检查是否是同级元素
      if (!isSibling) {
        var urls = siblingUrls[i].urls;
        for (var t = 0; t < urls.length; t++) {
          if (realUrl == urls[t]) {
            isSibling = true;
            currentSiblingsUrls = urls;
            break;
          }
        }
      } else {
        break;
      }
    }
    var urlName = getUrlNameFormPermission(realUrl);
    var siblingsExist = false;
    if (isSibling) { // 当前链接属于同级
      var tempUrlStack = [];
      for (var i = 0; i < urlStack.length; i++) {
        tempUrlStack[i] = urlStack[i];
        var tempUrl = getRelativeUrl(urlStack[i].url);
        for (var t = 0; t < currentSiblingsUrls.length; t++) {
          // 属于平级元素
          if (tempUrl == currentSiblingsUrls[t]) {
            siblingsExist = true;
            break;
          }
        }
        // 废弃同级元素后面的元素，替换当前元素为最新的
        if (siblingsExist) {
          tempUrlStack[i] = {
            name: urlName,
            url: nowUrl
          };
          break;
        }
      }
      urlStack = tempUrlStack;

    }
    if (!siblingsExist) {
      if (nowUrl.indexOf("noStack") == -1) {
        urlStack.push({ // 插入一条最新的
          name: urlName,
          url: nowUrl
        });
      }
    }
  }
  storage.setItem("urlStack", JSON.stringify(urlStack));
});

/** 返回调用方法 */
function goBack() {
  var url = getGoBackUrl();
  if (!isEmpty(url))
    window.location.href = url;
}
/**
 * 获取上一步的url地址
 */
function getGoBackUrl() {
  var storage = window.sessionStorage;
  var urlStack = eval('(' + storage.getItem('urlStack') + ')');
  // 如果前进的大于3,直接返回首页
  if (urlStack.length > 3) {
    return urlStack[0].url;
  }
  var index = 0;
  for (var i =urlStack.length - 1; i >= 0; i--) {
    if (!isEmpty(urlStack[i].url)) {
      index++;
    }
    if (index == 2) // 返回倒数第二个带url的
    {
      return urlStack[i].url;
    }

  }
  return "";
}

/**
 * 添加一条数据到UrlStack
 * 
 * @param name
 * @param url
 */
function pushToUrlStack(name, url) {
  if (url.indexOf("noStack") >= 0) {
    return;
  }
  var storage = window.sessionStorage;
  var urlStack = storage.getItem('urlStack');
  urlStack = eval('(' + urlStack + ')');
  urlStack.push({
    name: name,
    url: convertEmpty(url)
  });
  storage.setItem("urlStack", JSON.stringify(urlStack));
}

/**
 * 替换url栈中的最后一条数据
 * 
 * @param name
 * @param url
 */
function replaceUrlStackLast(name, url) {
  if (url.indexOf("noStack") >= 0) {
    return;
  }
  var storage = window.sessionStorage;
  var urlStack = storage.getItem('urlStack');
  urlStack = eval('(' + urlStack + ')');
  urlStack[urlStack.length - 1] = { // 将最新的替换以前的
    name: name,
    url: convertEmpty(url)
  };
  storage.setItem("urlStack", JSON.stringify(urlStack));
}

/**
 * 删除url栈中的最后一条数据
 * 
 * @param name
 * @param url
 */
function removeUrlStackLast() {
  var storage = window.sessionStorage;
  var urlStack = storage.getItem('urlStack');
  urlStack = eval('(' + urlStack + ')');
  urlStack.pop(); // 删除最后一条
  storage.setItem("urlStack", JSON.stringify(urlStack));
}