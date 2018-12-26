package com.hd.cdaims.dao.model;

import java.util.Date;

/**
 * cdaims_filter_rule
 */
public class CdaimsFilterRule {
    /**
     * 主键id cdaims_filter_rule.id
     */
    private Long id;

    /**
     * 疑似诊断名 cdaims_filter_rule.suspected_diagnostic_name
     */
    private String suspectedDiagnosticName;

    /**
     * 疑似诊断编号 cdaims_filter_rule.suspected_diagnostic_code
     */
    private String suspectedDiagnosticCode;

    /**
     * 确诊诊断名 cdaims_filter_rule.confirmed_diagnosis_name
     */
    private String confirmedDiagnosisName;

    /**
     * 确诊门诊编号 cdaims_filter_rule.confirmed_diagnosis_code
     */
    private String confirmedDiagnosisCode;

    /**
     * 租户ID cdaims_filter_rule.fk_tenant_id
     */
    private Integer fkTenantId;

    /**
     * 创建时间 cdaims_filter_rule.create_time
     */
    private Date createTime;

    /**
     * 创建人 cdaims_filter_rule.create_user_id
     */
    private Long createUserId;

    /**
     * 更新时间 cdaims_filter_rule.update_time
     */
    private Date updateTime;

    /**
     * 更新人 cdaims_filter_rule.update_user_id
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
     * 疑似诊断名
     */
    public String getSuspectedDiagnosticName() {
        return suspectedDiagnosticName;
    }

    /**
     * 疑似诊断名
     */
    public void setSuspectedDiagnosticName(String suspectedDiagnosticName) {
        this.suspectedDiagnosticName = suspectedDiagnosticName;
    }

    /**
     * 疑似诊断编号
     */
    public String getSuspectedDiagnosticCode() {
        return suspectedDiagnosticCode;
    }

    /**
     * 疑似诊断编号
     */
    public void setSuspectedDiagnosticCode(String suspectedDiagnosticCode) {
        this.suspectedDiagnosticCode = suspectedDiagnosticCode;
    }

    /**
     * 确诊诊断名
     */
    public String getConfirmedDiagnosisName() {
        return confirmedDiagnosisName;
    }

    /**
     * 确诊诊断名
     */
    public void setConfirmedDiagnosisName(String confirmedDiagnosisName) {
        this.confirmedDiagnosisName = confirmedDiagnosisName;
    }

    /**
     * 确诊门诊编号
     */
    public String getConfirmedDiagnosisCode() {
        return confirmedDiagnosisCode;
    }

    /**
     * 确诊门诊编号
     */
    public void setConfirmedDiagnosisCode(String confirmedDiagnosisCode) {
        this.confirmedDiagnosisCode = confirmedDiagnosisCode;
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