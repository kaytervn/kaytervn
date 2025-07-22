package com.msa.cloudinary.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

@Data
public class UploadFileForm {
    @NotNull(message = "File is required")
    private MultipartFile file;
}
