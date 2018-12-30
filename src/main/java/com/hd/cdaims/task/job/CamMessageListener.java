/**   
 * @Title: PdAppPushListener.java 
 * @Package com.xtt.pd.push
 * Copyright: Copyright (c) 2015
 * @author: bruce   
 * @date: 2018年7月17日 下午5:57:21 
 *
 */
package com.hd.cdaims.task.job;

import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import com.xtt.common.constants.CommonConstants;
import com.xtt.common.patient.service.IPatientService;
import com.xtt.platform.framework.core.redis.RedisCacheUtil;

@Component
public class CamMessageListener implements MessageListener, InitializingBean {
    private static final Logger LOGGER = LoggerFactory.getLogger(CamMessageListener.class);
    private ExecutorService executor = Executors.newFixedThreadPool(2);

    @Autowired
    private RedisMessageListenerContainer redisMessageListenerContainer;

    @Autowired
    private IPatientService patientService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = RedisCacheUtil.deserializeKey(message.getChannel());
        if (Objects.equals(CommonConstants.APP_PUSH_PATIENT, channel)) {// app患者信息推送
            Map<String, String> m = (Map<String, String>) RedisCacheUtil.deserializeValue(message.getBody());
            executor.execute(new PdPatientPush(m, patientService));
            LOGGER.info("app获取患者信息接口调用成功");
        }

    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Set<ChannelTopic> topics = new HashSet<>();
        topics.add(new ChannelTopic(CommonConstants.APP_PUSH_PATIENT));
        redisMessageListenerContainer.addMessageListener(this, topics);
    }

}
