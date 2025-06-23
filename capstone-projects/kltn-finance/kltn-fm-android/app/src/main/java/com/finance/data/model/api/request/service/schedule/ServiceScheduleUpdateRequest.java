package com.finance.data.model.api.request.service.schedule;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceScheduleUpdateRequest {
    Long serviceId;
    List<Integer> numberOfDueDaysList;
}
