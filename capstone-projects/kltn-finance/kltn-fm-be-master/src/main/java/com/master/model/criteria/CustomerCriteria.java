package com.master.model.criteria;

import com.master.constant.MasterConstant;
import com.master.model.AccountBranch;
import com.master.model.Branch;
import com.master.model.Customer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class CustomerCriteria implements Serializable {
    private Long id;
    private Long accountId;
    private String address;
    private String city;
    private Long branchId;
    private Integer status;
    private Integer sortDate;
    private Integer isPaged = MasterConstant.BOOLEAN_TRUE;
    @ApiModelProperty(hidden = true)
    private Long permissionAccountId;

    public Specification<Customer> getCriteria() {
        return new Specification<Customer>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Customer> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (StringUtils.isNotBlank(getAddress())) {
                    predicates.add(cb.like(cb.lower(root.get("address")), "%" + getAddress().toLowerCase() + "%"));
                }
                if (StringUtils.isNotBlank(getCity())) {
                    predicates.add(cb.like(cb.lower(root.get("city")), "%" + getCity().toLowerCase() + "%"));
                }
                if (getBranchId() != null) {
                    Join<Customer, Branch> join = root.join("branch", JoinType.INNER);
                    predicates.add(cb.equal(join.get("id"), getBranchId()));
                }
                if (getAccountId() != null) {
                    predicates.add(cb.equal(root.get("account").get("id"), getAccountId()));
                }
                if (getPermissionAccountId() != null) {
                    Join<Customer, Branch> join = root.join("branch", JoinType.INNER);
                    Subquery<Long> branchSubquery = query.subquery(Long.class);
                    Root<AccountBranch> accountBranchRoot = branchSubquery.from(AccountBranch.class);
                    branchSubquery.select(accountBranchRoot.get("branch").get("id")).where(cb.equal(accountBranchRoot.get("account").get("id"), getPermissionAccountId()));
                    predicates.add(join.get("id").in(branchSubquery));
                }
                if (getSortDate() != null) {
                    if (getSortDate().equals(MasterConstant.SORT_DATE_ASC)) {
                        query.orderBy(cb.asc(root.get("createdDate")));
                    } else {
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                return cb.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}
