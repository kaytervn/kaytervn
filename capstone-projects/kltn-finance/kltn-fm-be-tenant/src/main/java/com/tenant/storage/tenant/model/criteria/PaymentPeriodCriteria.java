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
public class PaymentPeriodCriteria {
    private Long id;
    private Integer state;
    private Date startDate;
    private Date endDate;
    private Integer status;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Integer sortDate; // 1: ASC, 2: DESC

    public Specification<PaymentPeriod> getCriteria() {
        return new Specification<PaymentPeriod>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<PaymentPeriod> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getState() != null){
                    predicates.add(cb.equal(root.get("state"), getState()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getStartDate() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), getStartDate()));
                }
                if (getEndDate() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), getEndDate()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("endDate")));
                    }else if (getSortDate().equals(FinanceConstant.SORT_DATE_DESC)){
                        query.orderBy(cb.desc(root.get("endDate")));
                    }
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}