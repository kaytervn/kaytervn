package com.base.auth.controller;


import com.base.auth.dto.ApiMessageDto;
import com.base.auth.dto.ErrorCode;
import com.base.auth.dto.ResponseListDto;
import com.base.auth.dto.address.AddressDto;
import com.base.auth.dto.category.CategoryDto;
import com.base.auth.exception.UnauthorizationException;
import com.base.auth.form.category.CreateCategoryForm;
import com.base.auth.form.category.UpdateCategoryForm;
import com.base.auth.mapper.CategoryMapper;
import com.base.auth.model.Address;
import com.base.auth.model.Category;
import com.base.auth.model.criteria.CategoryCriteria;
import com.base.auth.repository.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/category")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class CategoryController extends ABasicController {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CategoryMapper categoryMapper;


    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CA_L')")
    public ApiMessageDto<ResponseListDto<CategoryDto>> listCategory(@Valid CategoryCriteria categoryCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<CategoryDto>> apiMessageDto = new ApiMessageDto<>();

        Page<Category> serviceCategories = categoryRepository.findAll(CategoryCriteria.findCategoryByCriteria(categoryCriteria),pageable);
        ResponseListDto<CategoryDto> responseListDto = new ResponseListDto(categoryMapper.fromEntityToDtoList(serviceCategories.getContent()),serviceCategories.getTotalElements(), serviceCategories.getTotalPages());
        apiMessageDto.setData(responseListDto);
        apiMessageDto.setMessage("Get category list success");
        return  apiMessageDto;
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CA_V')")
    public ApiMessageDto<CategoryDto> getCategory(@PathVariable("id") Long id) {
        ApiMessageDto<CategoryDto> apiMessageDto = new ApiMessageDto<>();
        Category serviceCategory = categoryRepository.findById(id).orElse(null);
        if(serviceCategory == null){
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.CATEGORY_ERROR_NOT_FOUND);
            return apiMessageDto;
        }

        apiMessageDto.setData(categoryMapper.fromEntityToCategoryDto(serviceCategory));
        apiMessageDto.setResult(true);
        apiMessageDto.setMessage("Get category success.");
        return  apiMessageDto;
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CA_D')")
    public ApiMessageDto<String> deleteCategory(@PathVariable("id") Long id) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.CATEGORY_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        categoryRepository.deleteById(id);
        apiMessageDto.setMessage("Delete category success");
        return apiMessageDto;
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CA_C')")
    public ApiMessageDto<String> createCategory(@Valid @RequestBody CreateCategoryForm createCategoryForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Category categoryCheckName = categoryRepository.findByName(createCategoryForm.getName());
        if (categoryCheckName != null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.CATEGORY_ERROR_EXIST);
            return apiMessageDto;
        }
        categoryRepository.save(categoryMapper.fromCreateCategory(createCategoryForm));
        apiMessageDto.setMessage("Create category success");
        return apiMessageDto;
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CA_U')")
    public ApiMessageDto<String> updateCategory(@Valid @RequestBody UpdateCategoryForm updateCategoryForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Category categoryCheckName = categoryRepository.findByName(updateCategoryForm.getName());
        if (categoryCheckName != null && !Objects.equals(categoryCheckName.getId(),updateCategoryForm.getCategoryId())) {
            apiMessageDto.setResult(false);
            apiMessageDto.setMessage("Update category fail");
            apiMessageDto.setCode(ErrorCode.CATEGORY_ERROR_EXIST);
            return apiMessageDto;
        }

        Category category = categoryRepository.findById(updateCategoryForm.getCategoryId()).orElse(null);
        if (category == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.CATEGORY_ERROR_NOT_FOUND);
            return apiMessageDto;
        }

        categoryMapper.mappingForUpdateServiceCategory(updateCategoryForm, category);
        categoryRepository.save(category);
        apiMessageDto.setMessage("Update category success");
        return apiMessageDto;
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<CategoryDto>>> autoCompleteCategoryAuto(@Valid CategoryCriteria categoryCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<List<CategoryDto>>> apiMessageDto = new ApiMessageDto<>();
        ResponseListDto<List<CategoryDto>> responseListDto = new ResponseListDto<>();
        Page<Category> categories = categoryRepository.findAll(CategoryCriteria.findCategoryByCriteria(categoryCriteria), pageable);
        List<CategoryDto> addressAdminDtos = categoryMapper.fromCategoryToComplteDtoList(categories.getContent());

        responseListDto.setContent(addressAdminDtos);
        responseListDto.setTotalPages(categories.getTotalPages());
        responseListDto.setTotalElements(categories.getTotalElements());

        apiMessageDto.setData(responseListDto);
        apiMessageDto.setMessage("Get category success");
        return apiMessageDto;
    }
}
