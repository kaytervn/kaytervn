package com.master.model.criteria;

import com.master.constant.MasterConstant;
import com.master.model.AccountBranch;
import com.master.model.Branch;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class BranchCriteria {
    private Long id;
    private String name;
    private Integer status;
    @ApiModelProperty(hidden = true)
    private Long permissionAccountId;
    private Integer isPaged = MasterConstant.BOOLEAN_TRUE;
    private Long ignoreAccountId;

    public Specification<Branch> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getName())) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + getName().toLowerCase() + "%"));
            }
            if (getPermissionAccountId() != null) {
                Subquery<Long> branchSubquery = query.subquery(Long.class);
                Root<AccountBranch> accountBranchRoot = branchSubquery.from(AccountBranch.class);
                branchSubquery.select(accountBranchRoot.get("branch").get("id")).where(cb.equal(accountBranchRoot.get("account").get("id"), getPermissionAccountId()));
                predicates.add(root.get("id").in(branchSubquery));
            }
            if (getIgnoreAccountId() != null) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<AccountBranch> subRoot = subquery.from(AccountBranch.class);
                subquery.select(subRoot.get("branch").get("id"))
                        .where(cb.equal(subRoot.get("account").get("id"), getIgnoreAccountId()));
                predicates.add(cb.not(root.get("id").in(subquery)));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}