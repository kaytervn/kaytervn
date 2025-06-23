package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class KeyInformationPermissionCriteria {
    private Long id;
    private Integer status;
    private Integer permissionKind;
    private Long accountId;
    private Long keyInformationId;
    private Long keyInformationGroupId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE;

    public Specification<KeyInformationPermission> getCriteria() {
        return new Specification<KeyInformationPermission>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<KeyInformationPermission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
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
                    Join<TransactionPermission, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getKeyInformationId() != null){
                    Join<KeyInformationPermission, KeyInformation> joinKeyInformation = root.join("keyInformation", JoinType.INNER);
                    predicates.add(cb.equal(joinKeyInformation.get("id"), getKeyInformationId()));
                }
                if (getKeyInformationGroupId() != null){
                    Join<KeyInformationPermission, KeyInformationGroup> joinKeyInformationGroup = root.join("keyInformationGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinKeyInformationGroup.get("id"), getKeyInformationGroupId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
