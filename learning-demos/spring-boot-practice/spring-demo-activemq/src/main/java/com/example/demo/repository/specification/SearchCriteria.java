package com.example.demo.repository.specification;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Getter
public class SearchCriteria {
    String key;
    SearchOperation operation;
    Object value;

    public SearchCriteria(String key, String operation, Object value) {
        SearchOperation searchOperation = SearchOperation.getSimpleOperation(operation.charAt(0));
        this.key = key;
        this.operation = searchOperation;
        this.value = value;
    }
}
