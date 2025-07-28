package com.msa.storage.tenant.model.criteria;

import com.msa.storage.tenant.model.IdNumber;
import com.msa.storage.tenant.model.Tag;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class IdNumberCriteria {
    private Long id;
    private String keyword;
    private Long tagId;
    private Integer status;

    public Specification<IdNumber> getCriteria() {
        return (root, query, cb) -> {
            Join<IdNumber, Tag> tagJoin = root.join("tag", JoinType.LEFT);
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getKeyword())) {
                String keywordLower = "%" + getKeyword().toLowerCase() + "%";
                Predicate p1 = cb.like(cb.lower(root.get("name")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("code")), keywordLower);
                Predicate p3 = cb.like(cb.lower(root.get("note")), keywordLower);
                Predicate p4 = cb.like(cb.lower(tagJoin.get("name")), keywordLower);
                predicates.add(cb.or(p1, p2, p3, p4));
            }
            if (getTagId() != null) {
                Join<IdNumber, Tag> join = root.join("tag", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getTagId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(
                    cb.asc(tagJoin.get("name")),
                    cb.asc(root.get("name"))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
