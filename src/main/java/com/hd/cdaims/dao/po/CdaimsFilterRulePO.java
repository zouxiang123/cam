/**   
 * @Title: CkdFilterRulePO.java 
 * @Package com.xtt.ckd.dao.po
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年10月17日 下午2:38:51 
 *
 */
package com.hd.cdaims.dao.po;

import java.util.List;

import com.hd.cdaims.dao.model.CdaimsFilterRule;
import com.hd.cdaims.dao.model.CdaimsFilterValue;
import com.xtt.common.dao.po.AssayHospDictPO;

public class CdaimsFilterRulePO extends CdaimsFilterRule {

    private List<AssayHospDictPO> assaylist;// 化验项名称列表
    private List<CdaimsFilterValue> cdaimsFilterValues;// 化验项条件列表
    private String listStr;// 条件二组合

    public List<AssayHospDictPO> getAssaylist() {
        return assaylist;
    }

    public void setAssaylist(List<AssayHospDictPO> assaylist) {
        this.assaylist = assaylist;
    }

    public String getListStr() {
        return listStr;
    }

    public void setListStr(String listStr) {
        this.listStr = listStr;
    }

	public List<CdaimsFilterValue> getCdaimsFilterValues() {
		return cdaimsFilterValues;
	}

	public void setCdaimsFilterValues(List<CdaimsFilterValue> cdaimsFilterValues) {
		this.cdaimsFilterValues = cdaimsFilterValues;
	}

}
