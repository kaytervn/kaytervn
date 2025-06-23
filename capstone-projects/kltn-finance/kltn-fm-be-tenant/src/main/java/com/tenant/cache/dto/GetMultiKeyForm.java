package com.tenant.cache.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GetMultiKeyForm {
    private List<String> keys = new ArrayList<>();
}
