package com.base.auth.controller;

import com.base.auth.constant.UserBaseConstant;
import com.base.auth.dto.ApiMessageDto;
import com.base.auth.dto.ErrorCode;
import com.base.auth.dto.ResponseListDto;
import com.base.auth.dto.nation.NationAdminDto;
import com.base.auth.dto.nation.NationDto;
import com.base.auth.exception.BadRequestException;
import com.base.auth.exception.UnauthorizationException;
import com.base.auth.form.nation.CreateNationForm;
import com.base.auth.form.nation.UpdateNationForm;
import com.base.auth.mapper.NationMapper;
import com.base.auth.model.Address;
import com.base.auth.model.Nation;
import com.base.auth.model.criteria.NationCriteria;
import com.base.auth.repository.AddressRepository;
import com.base.auth.repository.NationRepository;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/nation")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class NationController extends ABasicController{
    @Autowired
    NationRepository nationRepository;

    @Autowired
    NationMapper nationMapper;

    @Autowired
    AddressRepository addressRepository;

    @PostMapping(value = "/create", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('N_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateNationForm createNationForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Nation nation = nationMapper.fromCreateFormToEntity(createNationForm);
        if(createNationForm.getParentId() != null) {
            nation.setParent(parentNation(createNationForm.getKind(),createNationForm.getParentId()));
        }
        nationRepository.save(nation);
        apiMessageDto.setMessage("Create nation success");
        return apiMessageDto;
    }
    private Nation parentNation(Integer nationKind, Long parentId){
        if(Objects.equals(nationKind, UserBaseConstant.NATION_KIND_PROVINCE)){
            throw new BadRequestException("Parent not allow with Province");
        }
        Nation parentNation = nationRepository.findById(parentId).orElse(null);
        if(parentNation == null) {
            throw new BadRequestException("Not found parent nation");
        }
        if (nationKind.intValue() - parentNation.getKind().intValue() != 1){
            throw new BadRequestException("Parent nation not valid");
        }
        return parentNation;
    }


    @PutMapping(value = "/update", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('N_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateNationForm updateNationForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Nation nation = nationRepository.findById(updateNationForm.getId()).orElse(null);
        if(nation == null){
            apiMessageDto.setResult(false);
            apiMessageDto.setMessage("Nation not exist");
            apiMessageDto.setCode(ErrorCode.NATION_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        nationMapper.fromUpdateFormToEntity(updateNationForm,nation);
        if(updateNationForm.getParentId() != null) {
            nation.setParent(parentNation(nation.getKind(),updateNationForm.getParentId()));
        }
        nationRepository.save(nation);
        apiMessageDto.setMessage("Update nation success");
        return apiMessageDto;
    }

    @GetMapping(value = "/get/{id}", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('N_V')")
    public ApiMessageDto<NationAdminDto> get(@PathVariable("id")  Long id) {
        ApiMessageDto<NationAdminDto> apiMessageDto = new ApiMessageDto<>();
        Nation nation = nationRepository.findById(id).orElse(null);
        if(nation == null){
            apiMessageDto.setResult(false);
            apiMessageDto.setMessage("Nation not found");
            apiMessageDto.setCode(ErrorCode.NATION_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        apiMessageDto.setData(nationMapper.fromEntityToAdminDto(nation));
        apiMessageDto.setMessage("Get nation success");
        return apiMessageDto;
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('N_L')")
    public ApiMessageDto<ResponseListDto<List<NationAdminDto>>> list(NationCriteria nationCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<List<NationAdminDto>>> responseListDtoApiMessageDto = new ApiMessageDto<>();
        Page<Nation> listCategory = nationRepository.findAll(NationCriteria.findNationByCriteria(nationCriteria), pageable);
        ResponseListDto<List<NationAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(nationMapper.convertToListAdminDto(listCategory.getContent()));
        responseListObj.setTotalPages(listCategory.getTotalPages());
        responseListObj.setTotalElements(listCategory.getTotalElements());
        responseListDtoApiMessageDto.setData(responseListObj);
        responseListDtoApiMessageDto.setMessage("Get list success");
        return responseListDtoApiMessageDto;
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<NationDto>>> autoComplete(NationCriteria nationCriteria) {
        ApiMessageDto<ResponseListDto<List<NationDto>>> responseListDtoApiMessageDto = new ApiMessageDto<>();
        Pageable pageable = PageRequest.of(0,10);
        nationCriteria.setStatus(UserBaseConstant.STATUS_ACTIVE);
        Page<Nation> nations = nationRepository.findAll(NationCriteria.findNationByCriteria(nationCriteria), pageable);
        ResponseListDto<List<NationDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(nationMapper.convertToAutoCompleteDto(nations.getContent()));
        responseListObj.setTotalPages(nations.getTotalPages());
        responseListObj.setTotalElements(nations.getTotalElements());
        responseListDtoApiMessageDto.setData(responseListObj);
        responseListDtoApiMessageDto.setMessage("Get list success");
        return responseListDtoApiMessageDto;
    }
    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("hasRole('N_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Nation nation = nationRepository.findById(id).orElse(null);
        if(nation == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NATION_ERROR_NOT_FOUND);
            apiMessageDto.setMessage("Not found nation");
            return apiMessageDto;
        }
        List<Long> children1 = nationRepository.getAllNationIdByParentId(Collections.singletonList(id));
        List<Long> children2 = nationRepository.getAllNationIdByParentId(children1);
        List<Long> nationIdsToDelete = new ArrayList<>();
        nationIdsToDelete.addAll(children1);
        nationIdsToDelete.addAll(children2);
        nationIdsToDelete.add(id);
        Address address = addressRepository.findByNationIdIn(nationIdsToDelete).orElse(null);
        if (address != null){
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NATION_ERROR_CANT_DELETE_RELATIONSHIP_WITH_ADDRESS);
            apiMessageDto.setMessage("Cant delete nation relationship to address");
            return apiMessageDto;
        }
        nationRepository.deleteAllByParentIdInList(children1);
        nationRepository.deleteAllByParentIdInList(Collections.singletonList(id));
        nationRepository.deleteById(id);
        apiMessageDto.setMessage("Delete nation success");
        return apiMessageDto;
    }
}
