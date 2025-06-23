/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package noti.thread;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.concurrent.*;

/**
 *
 * @author mac
 */
public class WorkerPool {
    private static WorkerPool instance = null;
    private static ThreadPoolExecutor executorPool = null;
    protected final static Logger logger = LogManager.getLogger(WorkerPool.class);

    private int queueCapacity;

    public WorkerPool(int thread, int queueCapacity, RejectedExecutionHandler rejectedExecutionHandler) {
        this.queueCapacity = queueCapacity;

        //Get the ThreadFactory implementation to use
        ThreadFactory threadFactory = Executors.defaultThreadFactory();
        //creating the ThreadPoolExecutor
        executorPool = new ThreadPoolExecutor(thread, 2*thread, 10, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(queueCapacity), threadFactory, rejectedExecutionHandler);
    }

    public void executeThread(Runnable runable) {
        executorPool.execute(runable);
    }

    public boolean isAvailable(){
        return  executorPool.getQueue().size() < queueCapacity;
    }

    /**
     * https://kipalog.com/posts/ThreadPoolExecutor-va--nguye-n-ta--c-qua-n-ly--pool-size
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
     * Với kịch bản như thế này, bạn sẽ luôn tiết kiệm được số lượng thread sử dụng là 5 trong trường hợp bình thường.
     * Nhưng vẫn có thể handle lên tới 15 thread nếu server quá tải.
     *
     * Điểm chúng ta hay nhầm lẫn là điều kiện để tạo thêm thread đó là khi hàng đợi phải full.
     * Đúng vậy, nếu hàng đợi chưa full, thì có nghĩa chúng ta chưa quá tải.
     * */
}
