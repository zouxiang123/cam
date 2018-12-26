/**   
 * @Title: CkdFilterRuleController.java 
 * @Package com.xtt.ckd.patient.controller
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年10月17日 上午10:37:51 
 *
 */
package com.hd.cdaims.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hd.cdaims.dao.po.CdaimsFilterRulePO;
import com.hd.cdaims.service.ICdaimsFilterRuleService;
import com.xtt.platform.util.http.HttpResult;

@Controller
@RequestMapping("/api/filter/filterRule/")
public class CdaimsFilterRuleController {
    @Autowired
    private ICdaimsFilterRuleService cdaimsFilterRuleService;

    /**
     * 编辑页面跳转
     * 
     * @Title: view
     * @param id
     * @return
     *
     */
    @RequestMapping("getById")
    @ResponseBody
    public HttpResult getById(Long id) {
        HttpResult rs = HttpResult.getSuccessInstance();
        rs.setRs(cdaimsFilterRuleService.getById(id));
        return rs;

    }

    /**
     * 保存
     * 
     * @Title: save
     * @param record
     * @return
     *
     */
    @RequestMapping("save")
    @ResponseBody
    public HttpResult save(CdaimsFilterRulePO record) {
        HttpResult rs = HttpResult.getSuccessInstance();
        cdaimsFilterRuleService.save(record);
        return rs;

    }

    /**
     * 获取筛查设置列表
     * 
     * @Title: list
     * @param record
     * @return
     *
     */
    @RequestMapping("list")
    @ResponseBody
    public HttpResult list(CdaimsFilterRulePO record) {
        HttpResult rs = HttpResult.getSuccessInstance();
        rs.setRs(cdaimsFilterRuleService.listByCondition(record));
        return rs;

    }

    /**
     * 根据id删除
     * 
     * @Title: deleteById
     * @param id
     * @return
     *
     */
    @RequestMapping("deleteById")
    @ResponseBody
    public HttpResult deleteById(Long id) {
        HttpResult rs = HttpResult.getSuccessInstance();
        rs.setRs(cdaimsFilterRuleService.deleteById(id));
        return rs;

    }

}
