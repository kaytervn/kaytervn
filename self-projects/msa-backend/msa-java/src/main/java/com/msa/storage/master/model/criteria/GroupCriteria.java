package com.msa.storage.master.model.criteria;

import com.msa.storage.master.model.Group;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class GroupCriteria {
    private Long id;
    private String name;
    private Integer kind;
    private Integer status;
    private Boolean isSystem;

    public Specification<Group> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getName())) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + getName().toLowerCase() + "%"));
            }
            if (getKind() != null) {
                predicates.add(cb.equal(root.get("kind"), getKind()));
            }
            if (getIsSystem() != null) {
                predicates.add(cb.equal(root.get("isSystem"), getIsSystem()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(
                    cb.desc(root.get("isSystem")),
                    cb.asc(root.get("kind")),
                    cb.asc(root.get("name"))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}