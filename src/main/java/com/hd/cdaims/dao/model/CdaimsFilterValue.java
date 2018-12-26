package com.hd.cdaims.dao.model;

import java.util.Date;

/**
 * cdaims_filter_value
 */
public class CdaimsFilterValue {
    /**
     * 主键id cdaims_filter_value.id
     */
    private Long id;

    /**
     * cdaims_filter_value.fk_filter_rule_id
     */
    private Long fkFilterRuleId;

    /**
     * 化验项名称 cdaims_filter_value.item_name
     */
    private String itemName;

    /**
     * 化验项编号 cdaims_filter_value.item_code
     */
    private String itemCode;

    /**
     * 过滤条件 cdaims_filter_value.item_filter
     */
    private String itemFilter;

    /**
     * 化验项值 cdaims_filter_value.item_value
     */
    private String itemValue;

    /**
     * 租户ID cdaims_filter_value.fk_tenant_id
     */
    private Integer fkTenantId;

    /**
     * 创建时间 cdaims_filter_value.create_time
     */
    private Date createTime;

    /**
     * 创建人 cdaims_filter_value.create_user_id
     */
    private Long createUserId;

    /**
     * 更新时间 cdaims_filter_value.update_time
     */
    private Date updateTime;

    /**
     * 更新人 cdaims_filter_value.update_user_id
     */
    private Long updateUserId;

    /**
     * 主键id
     */
    public Long getId() {
        return id;
    }

    /**
     * 主键id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     */
    public Long getFkFilterRuleId() {
        return fkFilterRuleId;
    }

    /**
     */
    public void setFkFilterRuleId(Long fkFilterRuleId) {
        this.fkFilterRuleId = fkFilterRuleId;
    }

    /**
     * 化验项名称
     */
    public String getItemName() {
        return itemName;
    }

    /**
     * 化验项名称
     */
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    /**
     * 化验项编号
     */
    public String getItemCode() {
        return itemCode;
    }

    /**
     * 化验项编号
     */
    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    /**
     * 过滤条件
     */
    public String getItemFilter() {
        return itemFilter;
    }

    /**
     * 过滤条件
     */
    public void setItemFilter(String itemFilter) {
        this.itemFilter = itemFilter;
    }

    /**
     * 化验项值
     */
    public String getItemValue() {
        return itemValue;
    }

    /**
     * 化验项值
     */
    public void setItemValue(String itemValue) {
        this.itemValue = itemValue;
    }

    /**
     * 租户ID
     */
    public Integer getFkTenantId() {
        return fkTenantId;
    }

    /**
     * 租户ID
     */
    public void setFkTenantId(Integer fkTenantId) {
        this.fkTenantId = fkTenantId;
    }

    /**
     * 创建时间
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * 创建时间
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 创建人
     */
    public Long getCreateUserId() {
        return createUserId;
    }

    /**
     * 创建人
     */
    public void setCreateUserId(Long createUserId) {
        this.createUserId = createUserId;
    }

    /**
     * 更新时间
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * 更新时间
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * 更新人
     */
    public Long getUpdateUserId() {
        return updateUserId;
    }

    /**
     * 更新人
     */
    public void setUpdateUserId(Long updateUserId) {
        this.updateUserId = updateUserId;
    }
}