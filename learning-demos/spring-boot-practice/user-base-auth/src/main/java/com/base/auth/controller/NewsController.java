package com.base.auth.controller;


import com.base.auth.constant.UserBaseConstant;
import com.base.auth.dto.ApiMessageDto;
import com.base.auth.dto.ErrorCode;
import com.base.auth.dto.ResponseListDto;
import com.base.auth.dto.news.NewsAdminDto;
import com.base.auth.dto.news.NewsAutoCompleteDto;
import com.base.auth.exception.BadRequestException;
import com.base.auth.form.news.CreateNewsForm;
import com.base.auth.form.news.UpdateNewsForm;
import com.base.auth.mapper.NewsMapper;
import com.base.auth.model.Category;
import com.base.auth.model.News;
import com.base.auth.model.criteria.NewsCriteria;
import com.base.auth.repository.CategoryRepository;
import com.base.auth.repository.NewsRepository;
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
@RequestMapping("/v1/news")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NewsController {
    @Autowired
    private NewsRepository newsRepository;
    @Autowired
    private NewsMapper newsMapper;
    @Autowired
    private CategoryRepository categoryRepository;


    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NEWS_L')")
    public ApiMessageDto<ResponseListDto<List<NewsAdminDto>>> list(NewsCriteria newsCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<List<NewsAdminDto>>> responseListObjApiMessageDto = new ApiMessageDto<>();
        Page<News> listCourse = newsRepository.findAll(newsCriteria.getSpecification(), pageable);
        ResponseListDto<List<NewsAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(newsMapper.fromEntityToNewsAdminDtoList(listCourse.getContent()));
        responseListObj.setTotalPages(listCourse.getTotalPages());
        responseListObj.setTotalElements(listCourse.getTotalElements());

        responseListObjApiMessageDto.setData(responseListObj);
        responseListObjApiMessageDto.setMessage("Get list success");
        return responseListObjApiMessageDto;
    }
    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<NewsAutoCompleteDto>>> autoComplete(NewsCriteria newsCriteria) {
        ApiMessageDto<ResponseListDto<List<NewsAutoCompleteDto>>> responseListObjApiMessageDto = new ApiMessageDto<>();
        newsCriteria.setStatus(UserBaseConstant.STATUS_ACTIVE);
        Pageable pageable = PageRequest.of(0,10);
        Page<News> listCourse = newsRepository.findAll(newsCriteria.getSpecification(), pageable);
        ResponseListDto<List<NewsAutoCompleteDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(newsMapper.fromEntityToNewsAutoCompleteDtoList(listCourse.getContent()));
        responseListObj.setTotalPages(listCourse.getTotalPages());
        responseListObj.setTotalElements(listCourse.getTotalElements());

        responseListObjApiMessageDto.setData(responseListObj);
        responseListObjApiMessageDto.setMessage("Get auto-complete list success");
        return responseListObjApiMessageDto;
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NEWS_V')")
    public ApiMessageDto<NewsAdminDto> get(@PathVariable("id") Long id) {
        ApiMessageDto<NewsAdminDto> apiMessageDto = new ApiMessageDto<>();
        News exsitingNews = newsRepository.findById(id).orElse(null);
        if (exsitingNews == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NEWS_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        apiMessageDto.setData(newsMapper.fromEntityToNewsAdminDto(exsitingNews));
        apiMessageDto.setResult(true);
        apiMessageDto.setMessage("Get news success.");
        return apiMessageDto;
    }
    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NEWS_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateNewsForm createNewsForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        News exsitingNews = newsRepository.findByTitle(createNewsForm.getTitle());
        if (exsitingNews != null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NEWS_ERROR_EXISTED);
            return apiMessageDto;
        }

        Category category = categoryRepository.findById(createNewsForm.getCategoryId()).orElse(null);
        if (category == null || !Objects.equals(category.getKind(), UserBaseConstant.CATEGORY_KIND_NEWS)) {
            throw new BadRequestException(ErrorCode.CATEGORY_ERROR_NOT_FOUND);
        }

        News news = newsMapper.fromCreateNewsFormToEntity(createNewsForm);
        news.setCategory(category);
        newsRepository.save(news);
        apiMessageDto.setMessage("Create news success");
        return apiMessageDto;

    }
    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NEWS_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateNewsForm updateNewsForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        News exsitingNews = newsRepository.findById(updateNewsForm.getId()).orElse(null);
        if (exsitingNews == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NEWS_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        if(!exsitingNews.getTitle().equals(updateNewsForm.getTitle())){
            Boolean exsitingNewsTitle = newsRepository.existsByTitle(updateNewsForm.getTitle());
            if (exsitingNewsTitle) {
                apiMessageDto.setResult(false);
                apiMessageDto.setMessage("Title đã tồn tại, không thể cập nhật");
                apiMessageDto.setCode(ErrorCode.NEWS_ERROR_EXISTED);
                return apiMessageDto;
            }
        }
        Category category = categoryRepository.findById(updateNewsForm.getCategoryId()).orElse(null);
        if (category == null) {
            throw new BadRequestException(ErrorCode.CATEGORY_ERROR_NOT_FOUND);
        }
        if(!Objects.equals(updateNewsForm.getCategoryId(), exsitingNews.getCategory().getId())){
            if(!Objects.equals(category.getKind(), UserBaseConstant.CATEGORY_KIND_NEWS)){
                apiMessageDto.setResult(false);
                apiMessageDto.setMessage("CATEGORY KIND phải là NEWS");
                return apiMessageDto;
            }
        }
        newsMapper.updateNewsFromUpdateNewsForm(updateNewsForm,exsitingNews);
        exsitingNews.setCategory(category);
        newsRepository.save(exsitingNews);
        apiMessageDto.setResult(true);
        apiMessageDto.setMessage("Update news success");
        return apiMessageDto;
    }
    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NEWS_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        News exsitingNews = newsRepository.findById(id).orElse(null);
        if (exsitingNews == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.NEWS_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        newsRepository.delete(exsitingNews);
        apiMessageDto.setMessage("Delete course success");
        return apiMessageDto;
    }
}
