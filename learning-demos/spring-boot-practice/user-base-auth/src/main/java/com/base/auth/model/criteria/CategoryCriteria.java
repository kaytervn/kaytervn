package com.base.auth.model.criteria;


import com.base.auth.model.Account;
import com.base.auth.model.Category;
import com.base.auth.model.Service;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class CategoryCriteria {

    private Long id;
    private String name;
    private Integer status;
    private Integer kind;

    public static Specification<Category> findCategoryByCriteria(final CategoryCriteria categoryCriteria) {
        return new Specification<Category>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Category> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();

                if (categoryCriteria.getId() != null) {
                    predicates.add(cb.equal(root.get("id"), categoryCriteria.getId()));
                }
                if (categoryCriteria.getId() != null) {
                    predicates.add(cb.equal(root.get("kind"), categoryCriteria.getKind()));
                }
                if (!StringUtils.isEmpty(categoryCriteria.getName())) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + categoryCriteria.getName().toLowerCase() + "%"));
                }
                if (categoryCriteria.getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), categoryCriteria.getStatus()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
