package com.example.demo.service;

import com.example.demo.repository.specification.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.example.demo.constant.AppConst.SEARCH_OPERATOR;

@Service
public class SearchService {
    public Predicate toPredicate(Path<?> path, CriteriaBuilder builder, SearchCriteria criteria) {
        return switch (criteria.getOperation()) {
            case EQUALITY -> builder.equal(path.get(criteria.getKey()), criteria.getValue());
            case NEGATION -> builder.notEqual(path.get(criteria.getKey()), criteria.getValue());
            case GREATER_THAN -> builder.greaterThan(path.get(criteria.getKey()), criteria.getValue().toString());
            case LESS_THAN -> builder.lessThan(path.get(criteria.getKey()), criteria.getValue().toString());
            case LIKE -> builder.like(path.get(criteria.getKey()), "%" + criteria.getValue() + "%");
        };
    }

    public <T> Predicate buildPredicate(From<T, ?> from, CriteriaBuilder builder, String[] criteria) {
        List<Predicate> predicates = new ArrayList<>();
        Pattern pattern = Pattern.compile(SEARCH_OPERATOR);
        for (String criterion : criteria) {
            Matcher matcher = pattern.matcher(criterion);
            if (matcher.find()) {
                SearchCriteria searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3));
                predicates.add(toPredicate(from, builder, searchCriteria));
            }
        }
        return builder.and(predicates.toArray(new Predicate[0]));
    }

    public <T> void applySort(Pageable pageable, Root<T> root, CriteriaBuilder builder, CriteriaQuery<T> query) {
        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                Path<Object> path = root.get(sortOrder.getProperty());
                orders.add(sortOrder.isAscending() ? builder.asc(path) : builder.desc(path));
            }
            query.orderBy(orders);
        }
    }
}
