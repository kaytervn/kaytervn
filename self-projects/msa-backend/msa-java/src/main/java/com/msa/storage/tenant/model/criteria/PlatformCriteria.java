package com.msa.storage.tenant.model.criteria;

import com.msa.constant.AppConstant;
import com.msa.controller.ABasicController;
import com.msa.storage.tenant.model.Platform;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PlatformCriteria {
    private Long id;
    private String name;
    private String url;
    private String keyword;
    private Integer status;
    private Integer sortOption;
    private String createdBy = "";

    public Specification<Platform> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("createdBy"), getCreatedBy()));
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getName())) {
                String keywordLower = "%" + getName().toLowerCase() + "%";
                Predicate p1 = cb.like(cb.lower(root.get("name")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("url")), keywordLower);
                predicates.add(cb.or(p1, p2));
            }
            if (StringUtils.isNotBlank(getUrl())) {
                predicates.add(cb.like(cb.lower(root.get("url")), "%" + getUrl().toLowerCase() + "%"));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            if (StringUtils.isNotBlank(getKeyword())) {
                String keywordLower = "%" + getKeyword().toLowerCase() + "%";
                Predicate p1 = cb.like(cb.lower(root.get("name")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("url")), keywordLower);
                predicates.add(cb.or(p1, p2));
            }
            List<Order> orderList = new ArrayList<>();
            if (getSortOption() != null) {
                if (getSortOption() == AppConstant.PLATFORM_SORT_ACCOUNTS_DESC) {
                    orderList.add(cb.desc(root.get("totalAccounts")));
                } else if (getSortOption() == AppConstant.PLATFORM_SORT_CREATED_DATE_DESC) {
                    orderList.add(cb.desc(root.get("createdDate")));
                }
            }
            orderList.add(cb.asc(root.get("name")));
            query.orderBy(orderList);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
