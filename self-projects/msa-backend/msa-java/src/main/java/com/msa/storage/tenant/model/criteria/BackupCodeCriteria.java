package com.msa.storage.tenant.model.criteria;

import com.msa.storage.tenant.model.Account;
import com.msa.storage.tenant.model.BackupCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class BackupCodeCriteria {
    private Long id;
    private Long accountId;
    private Integer status;
    private String createdBy = "";

    public Specification<BackupCode> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("createdBy"), getCreatedBy()));
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getAccountId() != null) {
                Join<BackupCode, Account> join = root.join("account", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getAccountId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(cb.desc(root.get("createdDate")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}