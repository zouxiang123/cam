/**   
 * @Title: CkdFilterRuleServiceImpl.java 
 * @Package com.xtt.ckd.patient.service.impl
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年10月17日 下午2:52:48 
 *
 */
package com.hd.cdaims.service.impl;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.hd.cdaims.dao.mapper.CdaimsFilterRuleMapper;
import com.hd.cdaims.dao.mapper.CdaimsFilterValueMapper;
import com.hd.cdaims.dao.model.CdaimsFilterValue;
import com.hd.cdaims.dao.po.CdaimsFilterRulePO;
import com.hd.cdaims.service.ICdaimsFilterRuleService;
import com.xtt.common.dao.mapper.AssayHospDictMapper;
import com.xtt.common.dao.po.AssayHospDictPO;
import com.xtt.common.util.DataUtil;
import com.xtt.common.util.UserUtil;

@Service
public class CdaimsFilterRuleServiceImpl implements ICdaimsFilterRuleService {
    @Autowired
    private CdaimsFilterRuleMapper cdaimsFilterRuleMapper;
    @Autowired
    private AssayHospDictMapper assayHospDictMapper;
    @Autowired
    private CdaimsFilterValueMapper cdaimsFilterValueMapper;

    public CdaimsFilterRulePO getById(Long id) {
        CdaimsFilterRulePO record = new CdaimsFilterRulePO();
        // 化验项
        AssayHospDictPO ap = new AssayHospDictPO();
        ap.setFkTenantId(UserUtil.getTenantId());
        if (id != null) {
            record = cdaimsFilterRuleMapper.getById(id);
            record.setCdaimsFilterValues(cdaimsFilterValueMapper.listByFkFilterRuleId(id));
        }
        return record;
    }

    public void save(CdaimsFilterRulePO record) {
        record.setFkTenantId(UserUtil.getTenantId());
        if (record.getId() != null) {
            DataUtil.setUpdateSystemFieldValue(record);
            if (!CollectionUtils.isEmpty(record.getCdaimsFilterValues())) {
                record.setConfirmedDiagnosisCode("");
                record.setConfirmedDiagnosisName("");
            }
            cdaimsFilterRuleMapper.updateByPrimaryKeySelective(record);
        } else {
            DataUtil.setSystemFieldValue(record);
            cdaimsFilterRuleMapper.insert(record);
        }

        // 更新子表
        List<CdaimsFilterValue> list = record.getCdaimsFilterValues();
        if (!CollectionUtils.isEmpty(list)) {
            // 先删除再新增
            cdaimsFilterValueMapper.deleteByFkFilterRuleId(record.getId());
            for (int i = 0; i < list.size(); i++) {
                CdaimsFilterValue CdaimsFilterValue = list.get(i);
                CdaimsFilterValue.setFkTenantId(record.getFkTenantId());
                CdaimsFilterValue.setFkFilterRuleId(record.getId());
                DataUtil.setSystemFieldValue(CdaimsFilterValue);
                cdaimsFilterValueMapper.insert(CdaimsFilterValue);
            }

        }
    }

    public List<CdaimsFilterRulePO> listByCondition(CdaimsFilterRulePO record) {
        List<CdaimsFilterRulePO> list = cdaimsFilterRuleMapper.listByCondition(record);
        list.forEach(p -> {
            String listStr = "";
            if (!StringUtils.isEmpty(p.getConfirmedDiagnosisName())) {
                listStr = p.getConfirmedDiagnosisName();
            } else {
                List<CdaimsFilterValue> lis = cdaimsFilterValueMapper.listByFkFilterRuleId(p.getId());
                for (int i = 0; i < lis.size(); i++) {
                    CdaimsFilterValue item = lis.get(i);
                    listStr += item.getItemName() + item.getItemFilter() + item.getItemValue() + ";";
                }
            }
            p.setListStr(listStr);
        });
        return list;
    }

    public int deleteById(Long id) {
        // 删除主表
        cdaimsFilterRuleMapper.deleteByPrimaryKey(id);
        // 删除关联表
        cdaimsFilterValueMapper.deleteByFkFilterRuleId(id);
        return 0;
    }

}
