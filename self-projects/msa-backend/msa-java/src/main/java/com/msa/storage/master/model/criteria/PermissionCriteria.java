package com.msa.storage.master.model.criteria;

import com.msa.constant.AppConstant;
import com.msa.storage.master.model.Permission;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PermissionCriteria {
    private Long id;
    private Integer kind;
    private Integer status;
    private Integer isPaged = AppConstant.BOOLEAN_TRUE;

    public Specification<Permission> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getKind() != null) {
                predicates.add(cb.equal(root.get("kind"), getKind()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(
                    cb.asc(root.get("nameGroup")),
                    cb.asc(root.get("name"))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}