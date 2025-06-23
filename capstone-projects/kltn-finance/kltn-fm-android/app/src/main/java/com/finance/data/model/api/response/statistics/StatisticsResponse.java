package com.finance.data.model.api.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse{
    private Long id;
    private String name;
    private Integer status;
    private String modifiedDate;
    private String createdDate;
    private Integer state;
    private String startDate;
    private String endDate;
    private String totalIncome;
    private String totalExpenditure;
}
