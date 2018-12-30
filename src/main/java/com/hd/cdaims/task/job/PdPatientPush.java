/**   
 * @Title: PdAddPatientPush.java 
 * @Package com.xtt.pd.push
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年7月18日 上午10:14:35 
 *
 */
package com.hd.cdaims.task.job;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.common.base.Objects;
import com.xtt.common.constants.CmSysParamConsts;
import com.xtt.common.constants.CommonConstants;
import com.xtt.common.dao.po.PatientPO;
import com.xtt.common.patient.service.IPatientService;
import com.xtt.common.util.SysParamUtil;
import com.xtt.common.util.UserUtil;
import com.xtt.platform.util.http.HttpClientResultUtil;
import com.xtt.platform.util.http.HttpClientUtil;

public class PdPatientPush extends Thread {
    private static final Logger LOGGER = LoggerFactory.getLogger(PdPatientPush.class);
    private Map<String, String> mapStr;
    private IPatientService patientService;

    PdPatientPush(Map<String, String> mapStr, IPatientService patientService) {
        this.mapStr = mapStr;
        this.patientService = patientService;
        super.setName("app-patient-push-thread");
    }

    @Override
    public void run() {
        if (mapStr != null) {
            Long patientId = Long.valueOf(mapStr.get("patientId"));
            Integer tenantId = Integer.valueOf(mapStr.get("tenantId"));
            String sysOwner = mapStr.get("sysOwner");
            UserUtil.setThreadTenant(tenantId, sysOwner);
            // app接口请求地址
            String url = SysParamUtil.getValueByName(CmSysParamConsts.HD_APP_ADDR) + "/api/patients/saveBatch.shtml";
            List<PatientPO> list = new ArrayList<PatientPO>();

            if (Objects.equal(mapStr.get("patientId"), CommonConstants.APP_PUSH_PATIENT_INIT)) {// 初始化患者所有未删除数据
                PatientPO pt = new PatientPO();
                pt.setDelFlag(false);
                list = patientService.selectByCondition(pt);
            } else {// 每个患者数据
                PatientPO patient = patientService.selectById(patientId);
                list.add(patient);
            }
            // 组装患者list
           /* List<PatientVO> appList = new ArrayList<PatientVO>();
            list.forEach(patient -> {
                PatientVO p = new PatientVO();
                p.setFkPatientId(patient.getId());
                // 账号为空默认为手机号
                String account = StringUtils.isEmpty(patient.getAccount()) ? patient.getMobile() : patient.getAccount();
                p.setAccount(account);
                // 密码默认为身份证后6位，否则默认为：123456
                String password = patient.getPassword();
                if (Objects.equal(patient.getIdType(), "1")) {// 类型为身份证
                    password = StringUtils.isEmpty(password)
                                    ? patient.getIdNumber().substring(patient.getIdNumber().length() - 6, patient.getIdNumber().length())
                                    : password;
                } else {
                    password = CommonConstants.APP_PUSH_PATIENT_PWD;
                }
                p.setPassword(MD5Util.md5(password));
                p.setName(patient.getName());
                p.setTel(patient.getMobile());
                p.setFkTenantId(patient.getFkTenantId());
                p.setIsSib("0");
                p.setInitial(patient.getInitial());
                p.setSpellInitials(patient.getSpellInitials());
                p.setSysOwner(patient.getSysOwner());
                p.setSex(patient.getSex());
                p.setBirthdayStr(DateFormatUtil.format(patient.getBirthday(), "yyyy-MM-dd"));
                p.setImagePath(patient.getImagePath());
                p.setBarcodePath(patient.getBarcodePath());
                p.setIsEnable(!patient.getDelFlag());
                p.setRelationship("ph");
                appList.add(p);
            });
            JsonUtil jston = JsonUtil.AllJsonUtil();
            postAddPatientToApp(url, jston.toJson(appList));*/
        }
    }

    /**
     * app新增患者接口
     * 
     * @Title: postAddPatientToApp
     * @param mapstr
     * @param patient
     *
     */
    public void postAddPatientToApp(String url, String param) {
        HttpClientResultUtil result = HttpClientUtil.postJson(url, param);
        if (result.getStatus() == 200) {
            LOGGER.info(result.getContext());
            return;
        }
        LOGGER.info("app患者信息接口调用失败！");
    }
}
