package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;

import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class TransactionGroupCriteria {
    private Long id;
    private Integer status;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Long permissionAccountId;
    private Integer sortDate;

    public Specification<TransactionGroup> getCriteria() {
        return new Specification<TransactionGroup>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<TransactionGroup> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<TransactionPermission> subquery = query.subquery(TransactionPermission.class);
                    Root<TransactionPermission> subRoot = subquery.from(TransactionPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.and(cb.equal(subRoot.get("transactionGroup"), root), cb.equal(subRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    }else{
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
