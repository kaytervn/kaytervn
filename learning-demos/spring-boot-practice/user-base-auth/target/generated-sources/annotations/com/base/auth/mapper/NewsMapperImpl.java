package com.base.auth.mapper;

import com.base.auth.dto.news.NewsAdminDto;
import com.base.auth.dto.news.NewsAutoCompleteDto;
import com.base.auth.form.news.CreateNewsForm;
import com.base.auth.form.news.UpdateNewsForm;
import com.base.auth.model.News;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-30T13:02:31+0700",
    comments = "version: 1.3.1.Final, compiler: javac, environment: Java 11.0.22 (Oracle Corporation)"
)
@Component
public class NewsMapperImpl implements NewsMapper {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public NewsAdminDto fromEntityToNewsAdminDto(News news) {
        if ( news == null ) {
            return null;
        }

        NewsAdminDto newsAdminDto = new NewsAdminDto();

        if ( news.getCreatedDate() != null ) {
            newsAdminDto.setCreatedDate( LocalDateTime.ofInstant( news.getCreatedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        if ( news.getModifiedDate() != null ) {
            newsAdminDto.setModifiedDate( LocalDateTime.ofInstant( news.getModifiedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        newsAdminDto.setDescription( news.getDescription() );
        newsAdminDto.setBanner( news.getBanner() );
        newsAdminDto.setPinTop( news.getPinTop() );
        newsAdminDto.setId( news.getId() );
        newsAdminDto.setAvatar( news.getAvatar() );
        newsAdminDto.setTitle( news.getTitle() );
        newsAdminDto.setCategory( categoryMapper.fromEntityToCategoryDto( news.getCategory() ) );
        newsAdminDto.setContent( news.getContent() );
        newsAdminDto.setStatus( news.getStatus() );

        return newsAdminDto;
    }

    @Override
    public List<NewsAdminDto> fromEntityToNewsAdminDtoList(List<News> news) {
        if ( news == null ) {
            return null;
        }

        List<NewsAdminDto> list = new ArrayList<NewsAdminDto>( news.size() );
        for ( News news1 : news ) {
            list.add( fromEntityToNewsAdminDto( news1 ) );
        }

        return list;
    }

    @Override
    public NewsAutoCompleteDto fromEntityToNewsAutoCompleteDto(News news) {
        if ( news == null ) {
            return null;
        }

        NewsAutoCompleteDto newsAutoCompleteDto = new NewsAutoCompleteDto();

        newsAutoCompleteDto.setDescription( news.getDescription() );
        newsAutoCompleteDto.setBanner( news.getBanner() );
        newsAutoCompleteDto.setPinTop( news.getPinTop() );
        newsAutoCompleteDto.setId( news.getId() );
        newsAutoCompleteDto.setAvatar( news.getAvatar() );
        newsAutoCompleteDto.setTitle( news.getTitle() );
        newsAutoCompleteDto.setContent( news.getContent() );
        newsAutoCompleteDto.setStatus( news.getStatus() );

        return newsAutoCompleteDto;
    }

    @Override
    public List<NewsAutoCompleteDto> fromEntityToNewsAutoCompleteDtoList(List<News> courses) {
        if ( courses == null ) {
            return null;
        }

        List<NewsAutoCompleteDto> list = new ArrayList<NewsAutoCompleteDto>( courses.size() );
        for ( News news : courses ) {
            list.add( fromEntityToNewsAutoCompleteDto( news ) );
        }

        return list;
    }

    @Override
    public News fromCreateNewsFormToEntity(CreateNewsForm createNewsForm) {
        if ( createNewsForm == null ) {
            return null;
        }

        News news = new News();

        news.setDescription( createNewsForm.getDescription() );
        news.setBanner( createNewsForm.getBanner() );
        news.setAvatar( createNewsForm.getAvatar() );
        news.setTitle( createNewsForm.getTitle() );
        news.setContent( createNewsForm.getContent() );
        if ( createNewsForm.getStatus() != null ) {
            news.setStatus( createNewsForm.getStatus() );
        }

        return news;
    }

    @Override
    public void updateNewsFromUpdateNewsForm(UpdateNewsForm updateNewsForm, News news) {
        if ( updateNewsForm == null ) {
            return;
        }

        if ( updateNewsForm.getDescription() != null ) {
            news.setDescription( updateNewsForm.getDescription() );
        }
        if ( updateNewsForm.getBanner() != null ) {
            news.setBanner( updateNewsForm.getBanner() );
        }
        if ( updateNewsForm.getAvatar() != null ) {
            news.setAvatar( updateNewsForm.getAvatar() );
        }
        if ( updateNewsForm.getTitle() != null ) {
            news.setTitle( updateNewsForm.getTitle() );
        }
        if ( updateNewsForm.getContent() != null ) {
            news.setContent( updateNewsForm.getContent() );
        }
        if ( updateNewsForm.getPinTop() != null ) {
            news.setPinTop( updateNewsForm.getPinTop() );
        }
        if ( updateNewsForm.getStatus() != null ) {
            news.setStatus( updateNewsForm.getStatus() );
        }
    }
}
