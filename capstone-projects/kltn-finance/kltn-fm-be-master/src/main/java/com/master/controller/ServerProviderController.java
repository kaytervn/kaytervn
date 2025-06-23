package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.serverProvider.ServerProviderAdminDto;
import com.master.dto.serverProvider.ServerProviderDto;
import com.master.form.serverProvider.CreateServerProviderForm;
import com.master.form.serverProvider.UpdateServerProviderForm;
import com.master.mapper.ServerProviderMapper;
import com.master.model.ServerProvider;
import com.master.model.criteria.ServerProviderCriteria;
import com.master.repository.DbConfigRepository;
import com.master.repository.ServerProviderRepository;
import com.master.utils.TenantUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/server-provider")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ServerProviderController extends ABasicController {
    @Autowired
    private ServerProviderRepository serverProviderRepository;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private ServerProviderMapper serverProviderMapper;
    @Value("${app.driver-class-name}")
    private String driverClassName;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_P_V')")
    public ApiMessageDto<ServerProviderAdminDto> get(@PathVariable("id") Long id) {
        ServerProvider serverProvider = serverProviderRepository.findById(id).orElse(null);
        if (serverProvider == null) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_NOT_FOUND, "Not found server provider");
        }
        return makeSuccessResponse(serverProviderMapper.fromEntityToServerProviderAdminDto(serverProvider), "Get server provider success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ServerProviderDto>>> autoComplete(ServerProviderCriteria serverProviderCriteria) {
        Pageable pageable = serverProviderCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        serverProviderCriteria.setStatus(MasterConstant.STATUS_ACTIVE);
        Page<ServerProvider> serverProviders = serverProviderRepository.findAll(serverProviderCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServerProviderDto>> responseListDto = new ResponseListDto<>();
        responseListDto.setContent(serverProviderMapper.fromEntityListToServerProviderDtoList(serverProviders.getContent()));
        responseListDto.setTotalPages(serverProviders.getTotalPages());
        responseListDto.setTotalElements(serverProviders.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list server provider success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_P_L')")
    public ApiMessageDto<ResponseListDto<List<ServerProviderAdminDto>>> list(ServerProviderCriteria serverProviderCriteria, Pageable pageable) {
        if (serverProviderCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<ServerProvider> serverProviders = serverProviderRepository.findAll(serverProviderCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServerProviderAdminDto>> responseListDto = new ResponseListDto<>();
        responseListDto.setContent(serverProviderMapper.fromEntityListToServerProviderAdminDtoList(serverProviders.getContent()));
        responseListDto.setTotalPages(serverProviders.getTotalPages());
        responseListDto.setTotalElements(serverProviders.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list server provider success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_P_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateServerProviderForm createServerProviderForm, BindingResult bindingResult) {
        ServerProvider serverProvider = serverProviderMapper.fromCreateServerProviderFormToEntity(createServerProviderForm);
        if (serverProviderRepository.findFirstByUrl(serverProvider.getUrl()).isPresent()) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_URL_EXISTED, "Url existed");
        }
        serverProvider.setDriverClassName(driverClassName);
        serverProvider.setMySqlJdbcUrl(TenantUtils.getMySqlJdbcUrl(createServerProviderForm.getHost(), createServerProviderForm.getPort()));
        serverProviderRepository.save(serverProvider);
        return makeSuccessResponse(null, "Create server provider success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_P_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateServerProviderForm updateServerProviderForm, BindingResult bindingResult) {
        ServerProvider serverProvider = serverProviderRepository.findById(updateServerProviderForm.getId()).orElse(null);
        if (serverProvider == null) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_NOT_FOUND, "Not found server provider");
        }
        if (updateServerProviderForm.getMaxTenant() < serverProvider.getCurrentTenantCount()) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_NOT_ALLOW_UPDATE, "Max tenants cannot be lower than current tenants count");
        }
        if (!serverProvider.getUrl().equals(updateServerProviderForm.getUrl())) {
            if (serverProviderRepository.findFirstByUrl(updateServerProviderForm.getUrl()).isPresent()) {
                return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_URL_EXISTED, "Url existed");
            }
        }
        serverProviderMapper.fromUpdateServerProviderFormToEntity(updateServerProviderForm, serverProvider);
        serverProviderRepository.save(serverProvider);
        return makeSuccessResponse(null,"Update server provider success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ServerProvider serverProvider = serverProviderRepository.findById(id).orElse(null);
        if (serverProvider == null) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_NOT_FOUND,"Not found server provider");
        }
        if (dbConfigRepository.existsByServerProviderId(id)) {
            return makeErrorResponse(ErrorCode.SERVER_PROVIDER_ERROR_NOT_ALLOW_DELETE, "Not allowed to delete server provider");
        }
        serverProviderRepository.deleteById(id);
        return makeSuccessResponse(null,"Delete server provider success");
    }
}
