package com.msa.storage.tenant.model.criteria;

import com.msa.storage.tenant.model.Bank;
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
public class BankCriteria {
    private Long id;
    private String keyword;
    private Long tagId;
    private Integer status;
    private String createdBy = "";

    public Specification<Bank> getCriteria() {
        return (root, query, cb) -> {
            Join<Bank, Tag> tagJoin = root.join("tag", JoinType.LEFT);
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("createdBy"), getCreatedBy()));
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getKeyword())) {
                String keywordLower = "%" + getKeyword().toLowerCase() + "%";
                Predicate p1 = cb.like(cb.lower(root.get("username")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("numbers")), keywordLower);
                Predicate p3 = cb.like(cb.lower(tagJoin.get("name")), keywordLower);
                predicates.add(cb.or(p1, p2, p3));
            }
            if (getTagId() != null) {
                Join<Bank, Tag> join = root.join("tag", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getTagId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(
                    cb.asc(tagJoin.get("name")),
                    cb.asc(root.get("username"))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
