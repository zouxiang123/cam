
package com.hd.cdaims.home.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.xtt.common.cache.TenantCache;
import com.xtt.common.constants.CommonConstants;
import com.xtt.common.dto.SysObjDto;
import com.xtt.common.dto.TenantDto;
import com.xtt.common.home.controller.CmLoginController;
import com.xtt.common.util.HttpServletUtil;
import com.xtt.common.util.PermissionUtil;
import com.xtt.common.util.UserUtil;
import com.xtt.platform.util.http.HttpResult;
import com.xtt.platform.util.lang.StringUtil;

@Controller
@RequestMapping
public class HdLoginController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HdLoginController.class);

    @Autowired
    private CmLoginController cmLoginController;

    /**
     * 
     * @Title: index
     * @return
     * @throws Exception
     * @return: ModelAndView
     * 
     */
    @RequestMapping("index")
    public ModelAndView index() {
        ModelAndView model = new ModelAndView("index");
        if (UserUtil.isAdmin()) {// 如果是管理员，直接重定向到管理员页面
            model.setViewName("cdaims/conf/conf_index");
        }
        return model;
    }

    /**
     * url跳转
     * 
     * @Title: openUrl
     * @param baseUrl
     *            请求服务地址
     * @param key
     *            权限key
     * @param param
     *            除sys以外的参数
     * @param redirectUrl
     *            直接重定向的地址
     * @return
     * @throws UnsupportedEncodingException
     *
     */
    @RequestMapping("openUrl")
    public String openUrl(String baseUrl, String key, String param, String redirectUrl) throws UnsupportedEncodingException {
        if (StringUtil.isBlank(redirectUrl)) {// 如果重定向的地址不为空，直接跳转
            SysObjDto obj = PermissionUtil.getObjByKey(key);
            if (obj == null || StringUtil.isBlank(obj.getUrl())) {
                return "error/403";
            }
            baseUrl = StringUtil.stripToEmpty(baseUrl);
            baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl.concat("/");
            redirectUrl = baseUrl.concat(obj.getUrl()).concat(".shtml");
            if (StringUtil.isNotBlank(param)) {
                redirectUrl = redirectUrl.concat("?").concat(param);
            }
        }
        return "redirect:" + redirectUrl;
    }

    /**
     * 登陆动作
     * 
     * @Title: login
     * @param account
     * @param password
     * @param tenantId
     * @return
     * @throws Exception
     * 
     */
    @RequestMapping("login")
    @SuppressWarnings("unchecked")
    public ModelAndView login(HttpServletResponse response, String account, String password, Integer tenantId, String redirectUrl,
                    Boolean isloginSubmit) throws Exception {
        ModelAndView model = new ModelAndView("login");
        if ("true".equals(HttpServletUtil.getCookieValueByName("savePwd")) && StringUtils.isEmpty(account) && StringUtils.isEmpty(password)) {
            account = HttpServletUtil.getCookieValueByName("account");
            password = HttpServletUtil.getCookieValueByName("password");
            String tenantIdStr = HttpServletUtil.getCookieValueByName("tenantId");
            if (StringUtils.isNotBlank(tenantIdStr)) {
                tenantId = Integer.parseInt(tenantIdStr);
            }
        }
        TenantDto defaultTenant = TenantCache.getDefault();
        String tenantName = defaultTenant == null ? "" : defaultTenant.getName();
        // 如果不是点击登录按钮,而且账号或者密码不存在，跳转到登录页面
        if (isloginSubmit == null && (StringUtils.isEmpty(account) || StringUtils.isEmpty(password))) {
            model.addObject("tenantName", tenantName);
            model.addObject("redirectUrl", redirectUrl);
            return model;
        }
        LOGGER.info("login message :account={},tenantId={},redirectUrl={}", account, tenantId, redirectUrl);
        Map<String, String> params = new HashMap<>(4);
        params.put("account", account);
        params.put("password", password);
        if (tenantId != null) {
            params.put("tenantId", tenantId.toString());
        }
        params.put("sysOwner", CommonConstants.SYS_CKD);

        HttpResult loginResult = cmLoginController.cmLoginSubmit(account, password, tenantId, CommonConstants.SYS_CKD);
        if (HttpResult.SUCCESS.equals(loginResult.getStatus())) {
            LOGGER.info("account={} login success,normal submit", account);
            HttpServletUtil.addCookie(response, CommonConstants.COOKIE_TOKEN, loginResult.getRs().toString(), -1);
            HttpServletUtil.addCookie(response, "cacheFlag", "0", -1);// 设置权限缓存状态为未缓存
            if (StringUtils.isNotEmpty(redirectUrl)) {
                model.setViewName("redirect:" + redirectUrl);
            } else {
                model.setViewName("redirect:/index.shtml");
            }
            return model;
        } else {
            model.addAllObjects((Map<String, Object>) loginResult.getRs());
            model.addObject(CommonConstants.ERROR_MESSAGE, loginResult.getErrmsg());
        }
        model.addObject("tenantName", tenantName);
        model.addObject("redirectUrl", redirectUrl);
        return model;
    }

    /**
     * 登出
     */
    @RequestMapping("logout")
    public ModelAndView logout() {
        ModelAndView model = new ModelAndView("login");
        if (UserUtil.getLoginUser() != null) {// 用户是登陆状态，调用公用登出服务
            Map<String, String> params = new HashMap<>(1);
            params.put("sysOwner", CommonConstants.SYS_CKD);
            cmLoginController.cmLogout(CommonConstants.SYS_CKD);
        }
        if ("true".equals(HttpServletUtil.getCookieValueByName("savePwd"))) {
            model.addObject("account", HttpServletUtil.getCookieValueByName("account"));
            model.addObject("password", HttpServletUtil.getCookieValueByName("password"));
            model.addObject("tenantId", HttpServletUtil.getCookieValueByName("tenantId"));
        }
        TenantDto defaultTenant = TenantCache.getDefault();
        model.addObject("tenantName", defaultTenant == null ? "" : defaultTenant.getName());
        return model;
    }
}
