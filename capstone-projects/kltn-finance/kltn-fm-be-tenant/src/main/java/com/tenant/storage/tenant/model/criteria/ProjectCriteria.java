package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProjectCriteria {
    private Long id;
    private Integer status;
    private Long organizationId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Long permissionAccountId;
    private Integer sortDate;
    private Long tagId;

    public Specification<Project> getCriteria() {
        return new Specification<Project>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<TaskPermission> subquery = query.subquery(TaskPermission.class);
                    Root<TaskPermission> subRoot = subquery.from(TaskPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.and(cb.equal(subRoot.get("project"), root), cb.equal(subRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getOrganizationId() != null) {
                    Join<Project, Organization> joinOrganization = root.join("organization", JoinType.INNER);
                    predicates.add(cb.equal(joinOrganization.get("id"), getOrganizationId()));
                }
                if (getTagId() != null) {
                    Join<Project, Tag> joinTag = root.join("tag", JoinType.INNER);
                    predicates.add(cb.equal(joinTag.get("id"), getTagId()));
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