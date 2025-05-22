package com.base.auth.repository;

import com.base.auth.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NewsRepository extends JpaRepository<News, Long>, JpaSpecificationExecutor<News> {

    News findByTitle(String title);

    Boolean existsByTitle(String title);
}