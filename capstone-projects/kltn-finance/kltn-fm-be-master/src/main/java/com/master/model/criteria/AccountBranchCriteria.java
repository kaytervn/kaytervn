package com.master.model.criteria;

import com.master.model.Account;
import com.master.model.AccountBranch;
import com.master.model.Branch;
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
public class AccountBranchCriteria {
    private Long id;
    private Long branchId;
    private Long accountId;
    private Integer status;

    public Specification<AccountBranch> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getBranchId() != null) {
                Join<AccountBranch, Branch> join = root.join("branch", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getBranchId()));
            }
            if (getAccountId() != null) {
                Join<AccountBranch, Account> join = root.join("account", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getAccountId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}