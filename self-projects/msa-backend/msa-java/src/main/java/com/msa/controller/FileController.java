package com.msa.controller;

import com.msa.cloudinary.CloudinaryService;
import com.msa.cloudinary.dto.UploadFileDto;
import com.msa.cloudinary.dto.UploadFileForm;
import com.msa.dto.ApiMessageDto;
import com.msa.exception.BadRequestException;
import com.msa.storage.master.model.File;
import com.msa.storage.master.repository.FileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/v1/file")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileController extends ABasicController {
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private FileRepository fileRepository;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<UploadFileDto> upload(@Valid UploadFileForm uploadFileForm, BindingResult bindingResult) {
        MultipartFile file = uploadFileForm.getFile();
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }
        try {
            UploadFileDto uploadResult = cloudinaryService.uploadFile(file);
            File fileModel = new File();
            fileModel.setUrl(uploadResult.getFilePath());
            fileRepository.save(fileModel);
            return makeSuccessResponse(uploadResult, "Upload successful");
        } catch (Exception e) {
            throw new BadRequestException("Upload failed");
        }
    }
}
