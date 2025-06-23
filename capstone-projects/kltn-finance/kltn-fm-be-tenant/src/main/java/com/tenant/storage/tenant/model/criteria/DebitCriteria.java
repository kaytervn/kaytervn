package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class DebitCriteria {
    private Long id;
    private Integer kind;
    private Integer state;
    private Integer status;
    private Long categoryId;
    private Long transactionGroupId;
    private Integer sortDate; // 1: asc, 2: desc
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Long permissionAccountId;
    private List<Long> debitIds;
    private Long tagId;

    public Specification<Debit> getCriteria() {
        return new Specification<Debit>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Debit> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<TransactionPermission> subquery = query.subquery(TransactionPermission.class);
                    Root<TransactionPermission> subRoot = subquery.from(TransactionPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.or(
                                            cb.and(cb.equal(subRoot.get("transaction"), root.get("transaction")), cb.equal(subRoot.get("permissionKind"), 1)),
                                            cb.and(cb.equal(subRoot.get("transactionGroup"), root.get("transactionGroup")), cb.equal(subRoot.get("permissionKind"), 2))
                                    )
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getKind() != null) {
                    predicates.add(cb.equal(root.get("kind"), getKind()));
                }
                if (getState() != null) {
                    predicates.add(cb.equal(root.get("state"), getState()));
                }
                if (getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getCategoryId() != null) {
                    Join<Debit, Category> joinCategory = root.join("category", JoinType.INNER);
                    predicates.add(cb.equal(joinCategory.get("id"), getCategoryId()));
                }
                if (getTransactionGroupId() != null) {
                    Join<Debit, TransactionGroup> joinTransactionGroup = root.join("transactionGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinTransactionGroup.get("id"), getTransactionGroupId()));
                }
                if (getTagId() != null) {
                    Join<Debit, Tag> joinTag = root.join("tag", JoinType.INNER);
                    predicates.add(cb.equal(joinTag.get("id"), getTagId()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    }else if (getSortDate().equals(FinanceConstant.SORT_DATE_DESC)){
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                    else if (getSortDate().equals(FinanceConstant.SORT_TRANSACTION_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("transactionDate")));
                    }
                    else if (getSortDate().equals(FinanceConstant.SORT_TRANSACTION_DATE_DESC)){
                        query.orderBy(cb.desc(root.get("transactionDate")));
                    }
                }
                if (getDebitIds() != null && !getDebitIds().isEmpty()) {
                    predicates.add(root.get("id").in(getDebitIds()));
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
