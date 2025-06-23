package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.location.LocationAdminDto;
import com.master.dto.location.LocationDto;
import com.master.form.location.CreateLocationForm;
import com.master.form.location.UpdateLocationByCustomer;
import com.master.form.location.UpdateLocationForm;
import com.master.mapper.LocationMapper;
import com.master.model.Customer;
import com.master.model.DbConfig;
import com.master.model.Location;
import com.master.model.ServerProvider;
import com.master.model.criteria.LocationCriteria;
import com.master.repository.CustomerRepository;
import com.master.repository.DbConfigRepository;
import com.master.repository.LocationRepository;
import com.master.repository.ServerProviderRepository;
import com.master.service.SessionService;
import com.master.service.impl.UserServiceImpl;
import com.master.utils.TenantUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/location")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class LocationController extends ABasicController {
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private LocationMapper locationMapper;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ServerProviderRepository serverProviderRepository;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private UserServiceImpl userService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_V')")
    public ApiMessageDto<LocationAdminDto> get(@PathVariable("id") Long id) {
        Location location = locationRepository.findById(id).orElse(null);
        if (location == null) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NOT_FOUND, "Not found location");
        }
        return makeSuccessResponse(locationMapper.fromEntityToLocationAdminDto(location), "Get location success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<LocationDto>>> autoComplete(LocationCriteria locationCriteria) {
        Pageable pageable = locationCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        locationCriteria.setStatus(MasterConstant.STATUS_ACTIVE);
        Page<Location> locations = locationRepository.findAll(locationCriteria.getCriteria(), pageable);
        ResponseListDto<List<LocationDto>> responseListDto = new ResponseListDto<>();
        responseListDto.setContent(locationMapper.fromEntityListToLocationDtoList(locations.getContent()));
        responseListDto.setTotalPages(locations.getTotalPages());
        responseListDto.setTotalElements(locations.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list location success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_L')")
    public ApiMessageDto<ResponseListDto<List<LocationAdminDto>>> list(LocationCriteria locationCriteria, Pageable pageable) {
        if (locationCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<Location> locations = locationRepository.findAll(locationCriteria.getCriteria(), pageable);
        ResponseListDto<List<LocationAdminDto>> responseListDto = new ResponseListDto<>();
        responseListDto.setContent(locationMapper.fromEntityListToLocationAdminDtoList(locations.getContent()));
        responseListDto.setTotalPages(locations.getTotalPages());
        responseListDto.setTotalElements(locations.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list location success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateLocationForm createLocationForm, BindingResult bindingResult) {
        Location location = locationMapper.fromCreateLocationFormToEntity(createLocationForm);
        if (locationRepository.findFirstByTenantId(location.getTenantId()).isPresent()) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_TENANT_ID_EXISTED, "Tenant id existed");
        }
        Customer customer = customerRepository.findById(createLocationForm.getCustomerId()).orElse(null);
        if (customer == null) {
            return makeErrorResponse(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Not found customer");
        }
        location.setCustomer(customer);
        if (locationRepository.findFirstByCustomerIdAndName(customer.getId(), location.getName()).isPresent()) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NAME_EXISTED, "Location name existed in this customer");
        }
        locationRepository.save(location);
        return makeSuccessResponse(null, "Create location success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateLocationForm updateLocationForm, BindingResult bindingResult) {
        Location location = locationRepository.findById(updateLocationForm.getId()).orElse(null);
        if (location == null) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NOT_FOUND, "Not found location");
        }
        if (!Objects.equals(location.getName(), updateLocationForm.getName()) && locationRepository.findFirstByCustomerIdAndName(location.getCustomer().getId(), updateLocationForm.getName()).isPresent()) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NAME_EXISTED, "Location name existed in this customer");
        }
        boolean isLock = MasterConstant.STATUS_ACTIVE.equals(location.getStatus()) && !MasterConstant.STATUS_ACTIVE.equals(updateLocationForm.getStatus());
        locationMapper.fromUpdateLocationFormToEntity(updateLocationForm, location);
        locationRepository.save(location);
        if (isLock) {
            sessionService.sendMessageLockLocation(location);
        }
        return makeSuccessResponse(null, "Update location success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Location location = locationRepository.findById(id).orElse(null);
        if (location == null) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NOT_FOUND, "Not found location");
        }
        DbConfig dbConfig = location.getDbConfig();
        if (dbConfig != null) {
            TenantUtils.deleteTenantDatabase(dbConfig);
            ServerProvider serverProvider = dbConfig.getServerProvider();
            serverProvider.setCurrentTenantCount(serverProvider.getCurrentTenantCount() - 1);
            dbConfigRepository.deleteById(dbConfig.getId());
            serverProviderRepository.save(serverProvider);
        }
        locationRepository.deleteById(id);
        if (MasterConstant.STATUS_ACTIVE.equals(location.getStatus())) {
            sessionService.sendMessageLockLocation(location);
        }
        return makeSuccessResponse(null, "Delete location success");
    }

    @PutMapping(value = "/update-by-customer", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LO_U_B_C')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateLocationByCustomer updateLocationForm, BindingResult bindingResult) {
        Location location = locationRepository.findFirstByTenantId(getCurrentTenantName()).orElse(null);
        if (location == null) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NOT_FOUND, "Not found location");
        }
        userService.checkValidLocation(location);
        if (!Objects.equals(location.getName(), updateLocationForm.getName()) && locationRepository.findFirstByCustomerIdAndName(location.getCustomer().getId(), updateLocationForm.getName()).isPresent()) {
            return makeErrorResponse(ErrorCode.LOCATION_ERROR_NAME_EXISTED, "Location name existed in this customer");
        }
        locationMapper.fromUpdateLocationFormByCustomerToEntity(updateLocationForm, location);
        locationRepository.save(location);
        return makeSuccessResponse(null, "Update location by customer success");
    }
}