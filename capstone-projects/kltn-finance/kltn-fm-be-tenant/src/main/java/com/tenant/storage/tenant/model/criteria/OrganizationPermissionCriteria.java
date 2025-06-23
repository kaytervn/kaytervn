package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrganizationPermissionCriteria {
    private Long id;
    private Integer status;
    private Long accountId;
    private Long organizationId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE;

    public Specification<OrganizationPermission> getCriteria() {
        return new Specification<OrganizationPermission>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<OrganizationPermission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getAccountId() != null){
                    Join<OrganizationPermission, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getOrganizationId() != null){
                    Join<OrganizationPermission, Organization> joinOrg = root.join("organization", JoinType.INNER);
                    predicates.add(cb.equal(joinOrg.get("id"), getOrganizationId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
