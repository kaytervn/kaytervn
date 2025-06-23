package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class NotificationGroupCriteria {
    private Long id;
    private Integer status;
    private Long ignoreServiceId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Integer sortDate;

    public Specification<NotificationGroup> getCriteria() {
        return new Specification<NotificationGroup>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<NotificationGroup> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getIgnoreServiceId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<ServiceNotificationGroup> subRoot = subquery.from(ServiceNotificationGroup.class);
                    subquery.select(subRoot.get("notificationGroup").get("id"))
                            .where(cb.equal(subRoot.get("service").get("id"), getIgnoreServiceId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
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
