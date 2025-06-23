package com.master.config;

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


    @Bean(name = "threadPoolExecutor")
    public TaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(threadPoolSize);
        executor.setMaxPoolSize(threadPoolSize);
        executor.setQueueCapacity(threadQueuePoolSize);
        executor.setThreadNamePrefix("spring-auth-invoke-");
        executor.initialize();
        return executor;
    }


    /**
     *
     * ThreadPoolExecutor và ThreadPoolTaskExecutor cũng là Executor nhưng nó có thêm các tham số như sau:
     *
     * corePoolSize: Số lượng Thread mặc định trong Pool
     * maxPoolSize: Số lượng tối đa Thread trong Pool
     * queueCapacity: Số lượng tối da của BlockingQueue
     * # Nguyên tắc vận hành
     *
     * Ví dụ với ThreadPoolExecutor có:
     *
     * corePoolSize: 5
     * maxPoolSize: 15
     * queueCapacity: 100
     *
     * Khi có request, nó sẽ tạo trong Pool tối đa 5 thread (corePoolSize).
     * Khi số lượng thread vượt quá 5 thread. Nó sẽ cho vào hàng đợi.
     * Khi số lượng hàng đợi full 100 (queueCapacity). Lúc này mới bắt đầu tạo thêm Thread mới.
     * Số thread mới được tạo tối đa là 15 (maxPoolSize).
     * Khi Request vượt quá số lượng 15 thread. Request sẽ bị từ chối!
     *
     *
     * */
}
