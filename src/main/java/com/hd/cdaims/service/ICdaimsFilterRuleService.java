/**   
 * @Title: CkdFilterRuleService.java 
 * @Package com.xtt.ckd.patient.service
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年10月17日 下午2:51:52 
 *
 */
package com.hd.cdaims.service;

import java.util.List;

import com.hd.cdaims.dao.po.CdaimsFilterRulePO;

public interface ICdaimsFilterRuleService {

    /**
     * 根据id获取对象
     * 
     * @Title: getById
     * @param id
     * @return
     *
     */
    public CdaimsFilterRulePO getById(Long id);

    /**
     * 保存
     * 
     * @Title: save
     * @param record
     *
     */
    public void save(CdaimsFilterRulePO record);

    /**
     * 查询
     * 
     * @Title: listByCondition
     * @param record
     * @return
     *
     */
    public List<CdaimsFilterRulePO> listByCondition(CdaimsFilterRulePO record);

    /**
     * 根据主键删除
     * 
     * @Title: deleteById
     * @param id
     * @return
     *
     */
    public int deleteById(Long id);
}
