
package com.hd.cdaims.api.controller;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xtt.common.constants.CommonConstants;
import com.xtt.common.home.controller.CmLoginController;
import com.xtt.common.util.HttpServletUtil;
import com.xtt.common.util.UserUtil;
import com.xtt.platform.util.http.HttpResult;

@Controller
@RequestMapping("/user/")
public class LoginController {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private CmLoginController cmLoginController;

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
    @ResponseBody
    @SuppressWarnings("unchecked")
    public HttpResult login(@RequestParam(value = "account", required = true)String account, 
    		@RequestParam(value = "password", required = true)String password, 
    		@RequestParam(value = "tenantId", required = false)Integer tenantId,
    		HttpServletResponse response) throws Exception {
    	HttpResult rs = HttpResult.getSuccessInstance();        
        // 如果不是点击登录按钮,而且账号或者密码不存在，跳转到登录页面
        if ((StringUtils.isEmpty(account) || StringUtils.isEmpty(password))) {
        	rs.setStatus(CommonConstants.FAILURE);
        	rs.setErrmsg("账号或者密码不能为空！");
            return rs;
        }
        
        Map<String, String> params = new HashMap<>(4);
        params.put("account", account);
        params.put("password", password);
        if (tenantId != null) {
            params.put("tenantId", tenantId.toString());
        }
        HttpResult loginResult = cmLoginController.cmLoginSubmit(account, password, tenantId, CommonConstants.SYS_CKD);
        if (HttpResult.SUCCESS.equals(loginResult.getStatus())) {            
            HttpServletUtil.addCookie(response, CommonConstants.COOKIE_TOKEN, loginResult.getRs().toString(), -1);
            HttpServletUtil.addCookie(response, "cacheFlag", "0", -1);// 设置权限缓存状态为未缓存
            rs.setToken(loginResult.getRs().toString());
            rs.setErrmsg("登录成功！");
        } else {  
        	rs.setStatus(CommonConstants.FAILURE);
            rs.setErrcode(loginResult.getErrmsg());
        }
        return rs;
    }

    /**
     * 登出
     */
    @RequestMapping("logout")
    @ResponseBody
    public HttpResult logout() {
    	HttpResult rs = HttpResult.getSuccessInstance();
        if (UserUtil.getLoginUser() != null) {// 用户是登陆状态，调用公用登出服务
            Map<String, String> params = new HashMap<>(1);
            params.put("sysOwner", CommonConstants.SYS_CKD);
            cmLoginController.cmLogout(CommonConstants.SYS_CKD);
        }        
       
        return rs;
    }
}
