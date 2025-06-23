package com.master.mapper;

import com.master.dto.branch.BranchDto;
import com.master.form.branch.CreateBranchForm;
import com.master.form.branch.UpdateBranchForm;
import com.master.model.Branch;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BranchMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    @BeanMapping(ignoreByDefault = true)
    Branch fromCreateBranchFormToEntity(CreateBranchForm createBranchForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateBranchFormToEntity(UpdateBranchForm updateBranchForm, @MappingTarget Branch branch);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToBranchDto")
    BranchDto fromEntityToBranchDto(Branch branch);

    @IterableMapping(elementTargetType = BranchDto.class, qualifiedByName = "fromEntityToBranchDto")
    List<BranchDto> fromEntityListToBranchDtoList(List<Branch> branchList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToBranchDtoAutoComplete")
    BranchDto fromEntityToBranchDtoAutoComplete(Branch branch);

    @IterableMapping(elementTargetType = BranchDto.class, qualifiedByName = "fromEntityToBranchDtoAutoComplete")
    List<BranchDto> fromEntityListToBranchDtoListAutoComplete(List<Branch> branchList);
}