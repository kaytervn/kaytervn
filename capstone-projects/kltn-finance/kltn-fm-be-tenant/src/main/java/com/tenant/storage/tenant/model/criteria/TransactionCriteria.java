package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class TransactionCriteria {
    private Long id;
    private Integer kind;
    private Integer state;
    private Integer status;
    private Long categoryId;
    private Long transactionGroupId;
    private Long paymentPeriodId;
    private Date startDate;
    private Date endDate;
    private Integer sortDate; // 1: asc, 2: desc
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Integer ignorePaymentPeriod = FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_FALSE;
    private List<Long> transactionIds;
    private Long permissionAccountId;
    private Long tagId;

    public Specification<Transaction> getCriteria() {
        return new Specification<Transaction>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Transaction> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<TransactionPermission> subquery = query.subquery(TransactionPermission.class);
                    Root<TransactionPermission> subRoot = subquery.from(TransactionPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.or(
                                            cb.and(cb.equal(subRoot.get("transaction"), root), cb.equal(subRoot.get("permissionKind"), 1)),
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
                    Join<Transaction, Category> joinCategory = root.join("category", JoinType.INNER);
                    predicates.add(cb.equal(joinCategory.get("id"), getCategoryId()));
                }
                if (getTransactionGroupId() != null) {
                    Join<Transaction, TransactionGroup> joinTransactionGroup = root.join("transactionGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinTransactionGroup.get("id"), getTransactionGroupId()));
                }
                if (getPaymentPeriodId() != null) {
                    Join<Transaction, PaymentPeriod> joinPaymentPeriod = root.join("paymentPeriod", JoinType.INNER);
                    predicates.add(cb.equal(joinPaymentPeriod.get("id"), getPaymentPeriodId()));
                }
                if (getStartDate() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("transactionDate"), getStartDate()));
                }
                if (getEndDate() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("transactionDate"), getEndDate()));
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
                if (FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE.equals(getIgnorePaymentPeriod())) {
                    predicates.add(cb.isNull(root.get("paymentPeriod")));
                }
                if (getTransactionIds() != null && !getTransactionIds().isEmpty()) {
                    predicates.add(root.get("id").in(getTransactionIds()));
                }
                if (getTagId() != null) {
                    Join<Transaction, Tag> joinTag = root.join("tag", JoinType.INNER);
                    predicates.add(cb.equal(joinTag.get("id"), getTagId()));
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
