package com.hd.cdaims.dao.mapper;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.hd.cdaims.dao.model.CdaimsFilterValue;

@Repository
public interface CdaimsFilterValueMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CdaimsFilterValue record);

    int insertSelective(CdaimsFilterValue record);

    CdaimsFilterValue selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CdaimsFilterValue record);

    int updateByPrimaryKey(CdaimsFilterValue record);

    /**
     * 根据fkFilterRuleId删除
     * 
     * @Title: deleteByFkFilterRuleId
     * @param fkFilterRuleId
     * @return
     *
     */
    int deleteByFkFilterRuleId(Long fkFilterRuleId);

    /**
     * 根据fkFilterRuleId查询数据
     * 
     * @Title: listByFkFilterRuleId
     * @param fkFilterRuleId
     * @return
     *
     */
    List<CdaimsFilterValue> listByFkFilterRuleId(Long fkFilterRuleId);
}