package com.base.auth.mapper;

import com.base.auth.dto.service.ServiceDto;
import com.base.auth.dto.service.ServicePublicDto;
import com.base.auth.form.service.CreateServiceForm;
import com.base.auth.form.service.UpdateServiceByCustomerForm;
import com.base.auth.form.service.UpdateServiceForm;
import com.base.auth.model.Service;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class})
public interface ServiceMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "serviceName", target = "serviceName")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "bannerPath", target = "bannerPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "settings", target = "settings")
    @Mapping(source = "lang", target = "lang")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "account", target = "accountDto", qualifiedByName = "fromAccountToDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromServiceToDto")
    ServiceDto fromServiceToDto(Service service);


    @Mapping(source = "id", target = "id")
    @Mapping(source = "serviceName", target = "serviceName")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "bannerPath", target = "bannerPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "settings", target = "settings")
    @Mapping(source = "lang", target = "lang")
    @Named("fromServiceToPublicDto")
    @BeanMapping(ignoreByDefault = true)
    ServicePublicDto fromServiceToPublicDto(Service service);


    @Mapping(source = "serviceName", target = "serviceName")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "bannerPath", target = "bannerPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "settings", target = "settings")
    @Mapping(source = "lang", target = "lang")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    Service fromServiceFromToEntity(CreateServiceForm form);


    @Mapping(source = "serviceName", target = "serviceName")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "bannerPath", target = "bannerPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "settings", target = "settings")
    @Mapping(source = "lang", target = "lang")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "fullName", target = "account.fullName")
    @Mapping(source = "phone", target = "account.phone")
    @Mapping(source = "tenantId", target = "tenantId")
    @BeanMapping(ignoreByDefault = true)
    void fromAdminUpdateFormToEntity(UpdateServiceForm updateServiceForm, @MappingTarget Service service);


    @Mapping(source = "serviceName", target = "serviceName")
    @Mapping(source = "bannerPath", target = "bannerPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "settings", target = "settings")
    @BeanMapping(ignoreByDefault = true)
    void fromCustomerUpdateFormToEntity(UpdateServiceByCustomerForm updateServiceByCustomerForm, @MappingTarget Service service);

    @IterableMapping(elementTargetType = ServiceDto.class, qualifiedByName = "fromServiceToDto")
    List<ServiceDto> fromEntityToCustomerDtoList(List<Service> list);
}
