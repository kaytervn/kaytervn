package com.msa.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.msa.cloudinary.dto.UploadFileDto;
import com.msa.storage.master.repository.FileRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private FileRepository fileRepository;

    public String extractIdFromFilePath(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        String[] parts = filePath.split("/");
        String fileName = parts[parts.length - 1];
        int dotIndex = fileName.indexOf('.');
        return (dotIndex != -1) ? fileName.substring(0, dotIndex) : fileName;
    }

    @Async
    public UploadFileDto uploadFile(MultipartFile file) throws Exception {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        UploadFileDto dto = new UploadFileDto();
        dto.setFilePath((String) uploadResult.get("secure_url"));
        return dto;
    }

    @Async
    public void deleteFile(String filePath) {
        if (StringUtils.isBlank(filePath)) {
            return;
        }
        try {
            String id = extractIdFromFilePath(filePath);
            Map result = cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
            String status = (String) result.get("result");
            if ("ok".equals(status) || "deleted".equals(status)) {
                fileRepository.deleteAllByUrl(filePath);
                log.warn(">>> Deleted file with id {}", id);
            }
        } catch (Exception ignored) {}
    }
}
