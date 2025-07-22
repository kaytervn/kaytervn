package com.msa.config;

import com.msa.constant.AppConstant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class ThreadConfig {
    @Value("${thread.pool.size:10}")
    private Integer threadPoolSize;
    @Value("${thread.pool.queue.size:100}")
    private Integer threadQueuePoolSize;

    @Bean(name = AppConstant.THREAD_POOL_EXECUTOR)
    public TaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(threadPoolSize);
        executor.setMaxPoolSize(threadPoolSize);
        executor.setQueueCapacity(threadQueuePoolSize);
        executor.setThreadNamePrefix("msa-invoke-");
        executor.initialize();
        return executor;
    }
}
