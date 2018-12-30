/**   
 * @Title: CKDPatientDisgnosisDataQuartzJob.java 
 * @Package com.xtt.ckd.task
 * Copyright: Copyright (c) 2015
 * @author: zx   
 * @date: 2018年10月23日 下午5:27:53 
 *
 */
package com.hd.cdaims.task.job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CKDPatientDisgnosisDataQuartzJob {
    private static final Logger LOGGER = LoggerFactory.getLogger(CKDPatientDisgnosisDataQuartzJob.class);
    /**
     * 每天凌晨执行一次 0 0 3 * * ? 每一分钟执行一次0 1/1 * * * ?
     * 
     * @Title: patientDisgnosisData
     *
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void patientDisgnosisData() {
        LOGGER.info("化验项数据清洗任务开始");
        /*Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, -7);// -1今天的时间减一天
        date = calendar.getTime();

        try {
            // 连接数据库
            HisJdbcUtil.getConnection();
            // 查询7天所有患者确诊诊断记录
            String sql = "select fk_patient_id fkPatientId,fk_tenant_id fkTenantId,pt_name ptName,sex,age,id_number idNumber,mobile,his_pt_id hisPtId,visit_date visitDate,disgnosis,doctor,curr_dept_name currDeptName,card_no cardNo from patient_visit where visit_date >='"
                            + DateUtil.format(date, "yyyy-MM-dd") + "'";
            List<Map<String, Object>> list = HisJdbcUtil.query(sql);
            List<CkdPatientFilterVO> visitlist = new ArrayList<CkdPatientFilterVO>();
            for (int i = 0; i < list.size(); i++) {
                CkdPatientFilterVO pv = JsonUtil.AllJsonUtil().fromJson(JsonUtil.AllJsonUtil().toJson(list.get(i)), CkdPatientFilterVO.class);
                visitlist.add(pv);
            }

            // 查询7天所有患者的化验项数据
            String sql1 = "select r.fk_patient_id fkPatientId,r.fk_tenant_id fkTenantId,v.pt_name ptName,v.sex,v.age,v.id_number idNumber,v.mobile,v.his_pt_id hisPtId,r.item_code itemCode,r.item_name itemName,r.assay_date assayDate,r.result_actual resultActual,v.curr_dept_name currDeptName,v.card_no cardNo from"
                            + " patient_assay_record r  LEFT JOIN patient_visit v on r.fk_patient_id=v.fk_patient_id where assay_date >='"
                            + DateUtil.format(date, "yyyy-MM-dd") + "' and v.visit_date >='" + DateUtil.format(date, "yyyy-MM-dd") + "'";
            List<Map<String, Object>> list1 = HisJdbcUtil.query(sql1);
            List<CkdPatientFilterVO> parList = new ArrayList<CkdPatientFilterVO>();
            for (int i = 0; i < list1.size(); i++) {
                CkdPatientFilterVO par = JsonUtil.AllJsonUtil().fromJson(JsonUtil.AllJsonUtil().toJson(list1.get(i)), CkdPatientFilterVO.class);
                parList.add(par);
            }

            // 查询7天所有化验项患者的数据
            String sql2 = "select r.fk_patient_id fkPatientId,r.fk_tenant_id fkTenantId,v.pt_name ptName,v.sex,v.age,v.id_number idNumber,v.mobile,v.his_pt_id hisPtId,r.item_code itemCode,r.item_name itemName,r.assay_date assayDate,r.result_actual resultActual,v.curr_dept_name currDeptName,v.card_no cardNo from"
                            + " patient_assay_record r LEFT JOIN patient_visit v on r.fk_patient_id=v.fk_patient_id where v.pt_name is not null and assay_date >='"
                            + DateUtil.format(date, "yyyy-MM-dd") + "' and v.visit_date >='" + DateUtil.format(date, "yyyy-MM-dd")
                            + "' group by r.fk_patient_id";
            List<Map<String, Object>> list2 = HisJdbcUtil.query(sql2);
            List<CkdPatientFilterVO> patientList = new ArrayList<CkdPatientFilterVO>();
            for (int i = 0; i < list2.size(); i++) {
                CkdPatientFilterVO par = JsonUtil.AllJsonUtil().fromJson(JsonUtil.AllJsonUtil().toJson(list2.get(i)), CkdPatientFilterVO.class);
                patientList.add(par);
            }
            // 筛查结果一
            List<CkdPatientFilterVO> result = new ArrayList<CkdPatientFilterVO>();
            // 查询筛查条件
            CkdFilterRulePO record = new CkdFilterRulePO();
            List<CkdFilterRulePO> filterList = ckdFilterRuleService.listByCondition(record);
            for (int i = 0; i < filterList.size(); i++) {

                CkdFilterRulePO ckdFilterRulePO = filterList.get(i);
                // 筛选指标1：确诊诊断名筛选
                if (!StringUtils.isEmpty(ckdFilterRulePO.getConfirmedDiagnosisName())) {
                    for (int j = 0; j < visitlist.size(); j++) {
                        CkdPatientFilterVO patientVisit = visitlist.get(j);
                        if (!StringUtils.isEmpty(patientVisit.getDisgnosis())) {
                            if (patientVisit.getDisgnosis().indexOf(ckdFilterRulePO.getConfirmedDiagnosisName()) != -1) {// 如果确诊诊断名存在则筛选
                                patientVisit.setSuspectedDiagnosticName(ckdFilterRulePO.getSuspectedDiagnosticName());
                                patientVisit.setFilterRuleId(ckdFilterRulePO.getId());
                                result.add(patientVisit);
                            }
                        }

                    }
                }

                // 筛选指标2：化验项筛选
                List<CkdFilterValue> lis = ckdFilterValueMapper.listByFkFilterRuleId(ckdFilterRulePO.getId());
                if (!CollectionUtils.isEmpty(lis)) {
                    for (int j = 0; j < patientList.size(); j++) {
                        Boolean isCheck = true;
                        CkdPatientFilterVO patient = patientList.get(j);
                        // 每个患者的化验项列表
                        List<CkdPatientFilterVO> patientPerAssayList = new ArrayList<CkdPatientFilterVO>();
                        for (int k = 0; k < parList.size(); k++) {
                            CkdPatientFilterVO assay = parList.get(k);
                            if (Objects.equals(patient.getFkPatientId(), assay.getFkPatientId())) {
                                patientPerAssayList.add(assay);
                            }
                        }
                        // 判断每个患者的化验项数据是否符合化验项筛选指标
                        loop: for (int k = 0; k < lis.size(); k++) {
                            if (!Check(lis.get(k), patientPerAssayList)) {// 若果任何一条不符合则该患者化验项不符合化验指标筛选排除
                                isCheck = false;
                                break loop;
                            }
                        }

                        if (isCheck) {// 全部符合则筛选改患者
                            patient.setSuspectedDiagnosticName(ckdFilterRulePO.getSuspectedDiagnosticName());
                            patient.setFilterRuleId(ckdFilterRulePO.getId());
                            result.add(patient);
                        }
                    }
                }

            }
            // 患者筛选历史保存
            // saveCkdPatientFilterHistory(result);
            ckdPatientFilterHistoryService.saveCkdPatientFilterHistory(result);
            // result去重
            result = removeDuplicate(result);
            // 查询慢病系统已有的患者卡号
            PatientCardPO patientCardPO = new PatientCardPO();
            patientCardPO.setDelFlag(false);
            List<PatientCardPO> patientCardList = patientCardMapper.selectByCondition(patientCardPO);
            // 查询慢病系统所有患者
            Patient patient = new Patient();
            List<PatientPO> ckdPatientList = patientMapper.selectByCondition(patient);
            // 根据卡号或者身份证号码筛除慢病系统已有的患者
            result = removeByCardNoAndIdNumber(result, patientCardList, ckdPatientList);

            // 查询已筛选的所有患者
            CkdPatientFilterPO CkdPatientFilterPO = new CkdPatientFilterPO();
            List<CkdPatientFilterPO> ckdPatientFilterList = ckdPatientFilterMapper.listByConditionHis(CkdPatientFilterPO);
            // 根据住院号和患者id除去慢病筛查已有的患者
            result = removeByHisPtIdAndFkPatientId(result, ckdPatientFilterList);
            // 保存唯一患者
            // saveCkdPatientFilter(result);
            ckdPatientFilterService.saveCkdPatientFilter(result);
        } catch (SQLException e) {
            LOGGER.info("his数据清洗失败");
            e.printStackTrace();
        }
    }

    *//**
     * 根据住院号和患者id除去慢病筛查已有的患者
     * 
     * @Title: removeByHisPtIdAndFkPatientId
     * @param result
     * @return
     *
     *//*
    private List<CkdPatientFilterVO> removeByHisPtIdAndFkPatientId(List<CkdPatientFilterVO> result, List<CkdPatientFilterPO> ckdPatientFilterList) {
        List<CkdPatientFilterVO> tempList = new ArrayList<CkdPatientFilterVO>();
        for (int i = 0; i < result.size(); i++) {
            CkdPatientFilterVO ckdPatientFilterVO = result.get(i);
            tempList.add(ckdPatientFilterVO);
            for (int j = 0; j < ckdPatientFilterList.size(); j++) {
                CkdPatientFilterPO ckdPatientFilterPO = ckdPatientFilterList.get(j);
                if (Objects.equals(ckdPatientFilterVO.getHisPtId(), ckdPatientFilterPO.getHisPtId())
                                && Objects.equals(ckdPatientFilterVO.getFkPatientId(), ckdPatientFilterPO.getFkPatientId())) {
                    tempList.remove(ckdPatientFilterVO);
                }
            }

        }
        return tempList;
    }

    *//**
     * 根据卡号或者身份证号码筛除慢病系统已有的患者
     * 
     * @Title: removePatientCard
     * @param result
     * @param patientCardList
     * @return
     *
     *//*
    private List<CkdPatientFilterVO> removeByCardNoAndIdNumber(List<CkdPatientFilterVO> result, List<PatientCardPO> patientCardList,
                    List<PatientPO> ckdPatientList) {
        List<CkdPatientFilterVO> tempList = new ArrayList<CkdPatientFilterVO>();
        for (int i = 0; i < result.size(); i++) {
            CkdPatientFilterVO ckdPatientFilterVO = result.get(i);
            tempList.add(ckdPatientFilterVO);
            for (int j = 0; j < patientCardList.size(); j++) {
                PatientCardPO patientCardPO = patientCardList.get(j);
                if (Objects.equals(ckdPatientFilterVO.getCardNo(), patientCardPO.getCardNo())) {// 卡号存在删除
                    tempList.remove(ckdPatientFilterVO);
                }
            }
            for (int j = 0; j < ckdPatientList.size(); j++) {
                PatientPO patientPO = ckdPatientList.get(j);
                if (Objects.equals(ckdPatientFilterVO.getIdNumber(), patientPO.getIdNumber())) {// 身份证存在删除
                    tempList.remove(ckdPatientFilterVO);
                }
            }
        }
        return tempList;
    }

    *//**
     * list去重
     * 
     * @Title: removeDuplicate
     * @param result
     * @return
     *
     *//*
    private List<CkdPatientFilterVO> removeDuplicate(List<CkdPatientFilterVO> result) {
        List<CkdPatientFilterVO> listTemp = new ArrayList<CkdPatientFilterVO>();
        HashSet<Long> set = new HashSet<Long>(result.size());
        for (int i = 0; i < result.size(); i++) {
            if (set.add(result.get(i).getFkPatientId())) {
                listTemp.add(result.get(i));
            }
        }

        return listTemp;
    }

    *//**
     * 化验项条件筛查
     * 
     * @Title: Check
     * @param string
     * @param vo
     * @return
     *
     *//*
    private boolean Check(CkdFilterValue ckdFilterValue, List<CkdPatientFilterVO> patientPerAssayList) {
        for (int i = 0; i < patientPerAssayList.size(); i++) {
            CkdPatientFilterVO vo = patientPerAssayList.get(i);
            Boolean result = false;
            if (vo.getResultActual() != null && !StringUtils.isEmpty(ckdFilterValue.getItemValue())
                            && !StringUtils.isEmpty(ckdFilterValue.getItemName()) && !StringUtils.isEmpty(ckdFilterValue.getItemFilter())) {
                if (Objects.equals(ckdFilterValue.getItemFilter(), ">")) {
                    result = vo.getResultActual() > Double.valueOf(ckdFilterValue.getItemValue());
                } else if (Objects.equals(ckdFilterValue.getItemFilter(), ">=")) {
                    result = vo.getResultActual() >= Double.valueOf(ckdFilterValue.getItemValue());
                } else if (Objects.equals(ckdFilterValue.getItemFilter(), "=")) {
                    result = vo.getResultActual() == Double.valueOf(ckdFilterValue.getItemValue());
                } else if (Objects.equals(ckdFilterValue.getItemFilter(), "<=")) {
                    result = vo.getResultActual() <= Double.valueOf(ckdFilterValue.getItemValue());
                } else if (Objects.equals(ckdFilterValue.getItemFilter(), "<")) {
                    result = vo.getResultActual() < Double.valueOf(ckdFilterValue.getItemValue());
                }
            }
            if (Objects.equals(ckdFilterValue.getItemCode(), vo.getItemCode()) && result) {
                return true;
            }
        }
        return false;*/
    }
}
