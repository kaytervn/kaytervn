package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class TransactionPermissionCriteria {
    private Long id;
    private Integer status;
    private Integer permissionKind;
    private Long accountId;
    private Long transactionId;
    private Long transactionGroupId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true

    public Specification<TransactionPermission> getCriteria() {
        return new Specification<TransactionPermission>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<TransactionPermission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
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
                if (getTransactionId() != null){
                    Join<TransactionPermission, Transaction> joinTransaction = root.join("transaction", JoinType.INNER);
                    predicates.add(cb.equal(joinTransaction.get("id"), getTransactionId()));
                }
                if (getTransactionGroupId() != null){
                    Join<TransactionPermission, TransactionGroup> joinTransactionGroup = root.join("transactionGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinTransactionGroup.get("id"), getTransactionGroupId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
