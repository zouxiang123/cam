package com.hd.cdaims.dao.mapper;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.hd.cdaims.dao.model.CdaimsFilterRule;
import com.hd.cdaims.dao.po.CdaimsFilterRulePO;

@Repository
public interface CdaimsFilterRuleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CdaimsFilterRule record);

    int insertSelective(CdaimsFilterRule record);

    CdaimsFilterRule selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CdaimsFilterRule record);

    int updateByPrimaryKey(CdaimsFilterRule record);

    /**
     * 根据id获取值
     * 
     * @Title: getById
     * @param id
     * @return
     *
     */
    CdaimsFilterRulePO getById(Long id);

    /**
     * 查询
     * 
     * @Title: listByCondition
     * @param record
     * @return
     *
     */
    List<CdaimsFilterRulePO> listByCondition(CdaimsFilterRule record);

}