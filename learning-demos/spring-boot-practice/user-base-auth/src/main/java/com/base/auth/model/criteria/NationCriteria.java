package com.base.auth.model.criteria;

import com.base.auth.model.Nation;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;


import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class NationCriteria {

    private Long id;
    private String name;
    private String postCode;
    private Integer kind;
    private Long parentId;
    private Integer status;
    private String parentName;

    public static Specification<Nation> findNationByCriteria(final NationCriteria nationCriteria) {
        return new Specification<Nation>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Nation> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (nationCriteria.getId() != null) {
                    predicates.add(cb.equal(root.get("id"), nationCriteria.getId()));
                }
                if (!StringUtils.isEmpty(nationCriteria.getName())) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + nationCriteria.getName().toLowerCase() + "%"));
                }
                if (!StringUtils.isEmpty(nationCriteria.getPostCode())) {
                    predicates.add(cb.equal(cb.lower(root.get("postCode")), nationCriteria.getPostCode().toLowerCase()));
                }
                if (nationCriteria.getKind() != null) {
                    predicates.add(cb.equal(root.get("kind"), nationCriteria.getKind()));
                }
                if (nationCriteria.getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), nationCriteria.getStatus()));
                }
                if (nationCriteria.getParentId() != null){
                    Join<Nation, Nation> join = root.join("parent", JoinType.INNER);
                    predicates.add(cb.equal(join.get("id"), nationCriteria.getParentId()));
                }
                if (nationCriteria.getParentName() != null){
                    Join<Nation, Nation> join = root.join("parent", JoinType.INNER);
                    predicates.add(cb.equal(join.get("name"), nationCriteria.getParentName()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
