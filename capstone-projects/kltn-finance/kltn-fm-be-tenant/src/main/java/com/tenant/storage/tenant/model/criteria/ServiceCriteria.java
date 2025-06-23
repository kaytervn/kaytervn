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
public class ServiceCriteria {
    private Long id;
    private Integer kind;
    private Integer periodKind;
    private Integer status;
    private Long serviceGroupId;
    private Date fromDate;
    private Date toDate;
    private Integer sortDate; // 1: asc by created date, 2: desc by created date, 3: asc by due date, 4: desc by due date
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Long permissionAccountId;
    private Integer tagId;

    public Specification<Service> getCriteria() {
        return new Specification<Service>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<Service> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<ServicePermission> subquery = query.subquery(ServicePermission.class);
                    Root<ServicePermission> subRoot = subquery.from(ServicePermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.or(
                                            cb.and(cb.equal(subRoot.get("service"), root), cb.equal(subRoot.get("permissionKind"), 1)),
                                            cb.and(cb.equal(subRoot.get("serviceGroup"), root.get("serviceGroup")), cb.equal(subRoot.get("permissionKind"), 2))
                                    )
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getKind() != null){
                    predicates.add(cb.equal(root.get("kind"), getKind()));
                }
                if(getPeriodKind() != null){
                    predicates.add(cb.equal(root.get("periodKind"), getPeriodKind()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getServiceGroupId() != null){
                    Join<Service, ServiceGroup> joinServiceGroup = root.join("serviceGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinServiceGroup.get("id"), getServiceGroupId()));
                }
                if (getFromDate() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), getFromDate()));
                }
                if (getToDate() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), getToDate()));
                }
                if (getTagId() != null) {
                    Join<Service, Tag> joinTag = root.join("tag", JoinType.INNER);
                    predicates.add(cb.equal(joinTag.get("id"), getTagId()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    } else if (getSortDate().equals(FinanceConstant.SORT_DATE_DESC)){
                        query.orderBy(cb.desc(root.get("createdDate")));
                    } else if (getSortDate().equals(FinanceConstant.SORT_DUE_DAYS_ASC)){
                        query.orderBy(
                                cb.asc(cb.coalesce(root.get("isPaid"), 0)),
                                cb.asc(cb.function("DATEDIFF", Integer.class, root.get("expirationDate"), cb.currentDate())),
                                cb.asc(root.get("createdDate"))
                        );
                    } else if (getSortDate().equals(FinanceConstant.SORT_DUE_DAYS_DESC)){
                        query.orderBy(
                                cb.desc(cb.coalesce(root.get("isPaid"), 0)),
                                cb.desc(cb.function("DATEDIFF", Integer.class, root.get("expirationDate"), cb.currentDate())),
                                cb.desc(root.get("createdDate"))
                        );
                    }
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
