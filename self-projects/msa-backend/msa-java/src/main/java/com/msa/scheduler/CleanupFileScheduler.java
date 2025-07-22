package com.msa.scheduler;

import com.msa.cloudinary.CloudinaryService;
import com.msa.storage.master.model.File;
import com.msa.storage.master.repository.FileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class CleanupFileScheduler {
    private static final long INTERVAL = 5 * 60 * 1000; // 5 minutes
    private static final int HOURS_TO_EXPIRED = 2; // 2 hours
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Scheduled(fixedRate = INTERVAL)
    public void clearFile() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, -HOURS_TO_EXPIRED);
        Date expiryTime = calendar.getTime();
        List<File> files = fileRepository.findAllByCreatedDateBefore(expiryTime);
        for (File file : files) {
            cloudinaryService.deleteFile(file.getUrl());
        }
    }
}
