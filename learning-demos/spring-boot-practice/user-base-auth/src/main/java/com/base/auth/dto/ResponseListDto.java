package com.base.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ResponseListDto<T> {
    private static final long serialVersionUID = 1L;

    private T content;
    private Long totalElements;
    private Integer totalPages;


}
