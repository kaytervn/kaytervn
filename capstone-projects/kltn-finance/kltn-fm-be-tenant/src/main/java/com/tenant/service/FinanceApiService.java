package com.tenant.service;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.UploadFileDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.UploadFileForm;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class FinanceApiService {
    static final String[] UPLOAD_TYPES = new String[]{"LOGO", "AVATAR","IMAGE", "DOCUMENT"};
    static final String[] AVATAR_EXTENSION = new String[]{"jpeg", "jpg", "gif", "bmp", "png"};
    @Value("${file.upload-dir}")
    String ROOT_DIRECTORY;
    @Autowired
    FinanceOTPService financeOTPService;
    @Autowired
    CommonAsyncService commonAsyncService;
    @Autowired
    KeyService keyService;

    private Map<String, Long> storeQRCodeRandom = new ConcurrentHashMap<>();

    public ApiMessageDto<UploadFileDto> storeFile(UploadFileForm uploadFileForm) {
        ApiMessageDto<UploadFileDto> apiMessageDto = new ApiMessageDto<>();
        try {
            boolean contains = Arrays.stream(UPLOAD_TYPES).anyMatch(uploadFileForm.getType()::equalsIgnoreCase);
            if (!contains) {
                throw new BadRequestException( "ERROR-UPLOAD-TYPE-INVALID", "Type is required in LOGO, AVATAR, IMAGE or DOCUMENT");
            }
            String fileName = StringUtils.cleanPath(uploadFileForm.getFile().getOriginalFilename());
            String extension = FilenameUtils.getExtension(fileName);
            if (uploadFileForm.getType().equals("AVATAR") && !Arrays.stream(AVATAR_EXTENSION).anyMatch(extension::equalsIgnoreCase)){
                throw new BadRequestException("ERROR-FILE-FORMAT-INVALID", "File format is invalid");
            }
            //upload to uploadFolder/TYPE/id
            String finalFile = uploadFileForm.getType() + "_" + RandomStringUtils.randomAlphanumeric(10) + "." + extension;
            String typeFolder = File.separator + uploadFileForm.getType();

            Path fileStorageLocation = Paths.get(ROOT_DIRECTORY + typeFolder).toAbsolutePath().normalize();
            Files.createDirectories(fileStorageLocation);
            Path targetLocation = fileStorageLocation.resolve(finalFile);
            byte[] fileBytes = uploadFileForm.getFile().getBytes();
            String base64FileContent = Base64.getEncoder().encodeToString(fileBytes);
            String encryptedContent = AESUtils.encrypt(keyService.getFinanceSecretKey(), base64FileContent, FinanceConstant.AES_ZIP_ENABLE);
            Files.write(targetLocation, Base64.getDecoder().decode(encryptedContent));
            UploadFileDto uploadFileDto = new UploadFileDto();
            uploadFileDto.setFilePath(typeFolder + File.separator + finalFile);
            apiMessageDto.setData(uploadFileDto);
            apiMessageDto.setMessage("Upload file success");
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            apiMessageDto.setResult(false);
            apiMessageDto.setMessage("" + e.getMessage());
        }
        return apiMessageDto;
    }

    public void deleteFile(String filePath) {
        File file = new File(ROOT_DIRECTORY + filePath);
//        file.deleteOnExit();
        if(file.exists()) file.delete();
    }

    public Resource loadFileAsResource(String folder, String fileName) {
        try {
            Path filePath = Paths.get(ROOT_DIRECTORY + File.separator + folder).resolve(fileName);
            String decryptedContent = AESUtils.decrypt(keyService.getFinanceSecretKey(), Base64.getEncoder().encodeToString(Files.readAllBytes(filePath)), FinanceConstant.AES_ZIP_ENABLE);
            byte[] decryptedBytes = Base64.getDecoder().decode(decryptedContent);
            Path tempFile = Files.createTempFile("Decrypted_", fileName);
            Files.write(tempFile, decryptedBytes);
            Resource resource = new UrlResource(tempFile.toUri());
            if (resource.exists()) {
                return resource;
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return null;
    }

    public InputStreamResource loadFileAsResourceExt(String folder, String fileName) {

        try {
            File file = new File(ROOT_DIRECTORY + File.separator + folder + File.separator + fileName);
            InputStreamResource inputStreamResource = new InputStreamResource(new FileInputStream(file));
            if (inputStreamResource.exists()) {
                return inputStreamResource;
            }
        } catch (FileNotFoundException ex) {
            log.error(ex.getMessage(), ex);

        }
        return null;
    }

    public String getOTPForgetPassword(){
        return financeOTPService.generate(4);
    }

    public synchronized Long getOrderHash(){
        return Long.parseLong(financeOTPService.generate(9))+System.currentTimeMillis();
    }

    public void sendEmail(String email, String msg, String subject, boolean html){
        commonAsyncService.sendEmail(email,msg,subject,html);
    }

    public String getOrderStt(Long storeId){
        return financeOTPService.orderStt(storeId);
    }

    public synchronized boolean checkCodeValid(String code){
        //delelete key has valule > 60s
        Set<String> keys = storeQRCodeRandom.keySet();
        Iterator<String> iterator = keys.iterator();
        while(iterator.hasNext()){
            String key = iterator.next();
            Long value = storeQRCodeRandom.get(key);
            if((System.currentTimeMillis() - value) > 60000){
                storeQRCodeRandom.remove(key);
            }
        }
        if(storeQRCodeRandom.containsKey(code)){
            return false;
        }
        storeQRCodeRandom.put(code,System.currentTimeMillis());
        return true;
    }
}
