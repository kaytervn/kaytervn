package com.finance.data.model.api.request.service.pay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePayRequest {
    Long id;
    String expirationDate;
}
