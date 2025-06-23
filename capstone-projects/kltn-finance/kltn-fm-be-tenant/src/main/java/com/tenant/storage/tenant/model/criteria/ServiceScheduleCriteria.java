package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class ServiceScheduleCriteria {
    private Long id;
    private Integer numberOfDueDays;
    private Long serviceId;
    private Integer status;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true

    public Specification<ServiceSchedule> getCriteria() {
        return new Specification<ServiceSchedule>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<ServiceSchedule> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getNumberOfDueDays() != null) {
                    predicates.add(cb.equal(root.get("numberOfDueDays"), getNumberOfDueDays()));
                }
                if (getServiceId() != null) {
                    Join<ServiceSchedule, Service> joinService = root.join("service", JoinType.INNER);
                    predicates.add(cb.equal(joinService.get("id"), getServiceId()));
                }
                if(getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                query.orderBy(cb.asc(root.get("ordering")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
