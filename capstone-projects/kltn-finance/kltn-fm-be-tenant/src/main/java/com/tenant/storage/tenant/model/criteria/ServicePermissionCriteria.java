package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class ServicePermissionCriteria {
    private Long id;
    private Integer status;
    private Integer permissionKind;
    private Long accountId;
    private Long serviceId;
    private Long serviceGroupId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true

    public Specification<ServicePermission> getCriteria() {
        return new Specification<ServicePermission>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<ServicePermission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if(getPermissionKind() != null){
                    predicates.add(cb.equal(root.get("permissionKind"), getPermissionKind()));
                }
                if (getAccountId() != null){
                    Join<ServicePermission, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getServiceId() != null){
                    Join<ServicePermission, Service> joinService = root.join("service", JoinType.INNER);
                    predicates.add(cb.equal(joinService.get("id"), getServiceId()));
                }
                if (getServiceGroupId() != null){
                    Join<ServicePermission, ServiceGroup> joinServiceGroup = root.join("serviceGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinServiceGroup.get("id"), getServiceGroupId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
