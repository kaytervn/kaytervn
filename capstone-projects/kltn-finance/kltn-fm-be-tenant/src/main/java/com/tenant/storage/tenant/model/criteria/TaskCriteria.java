package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class TaskCriteria {
    private Long id;
    private Integer state; // 1: Done, 2: Pending
    private Long projectId;
    private Long organizationId;
    private Integer status;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Integer sortDate;
    private Long parentId;
    private Integer ignoreProject = FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_FALSE;
    private Integer ignoreParent = FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_FALSE;
    private List<Long> taskIds;
    private Long permissionAccountId;

    public Specification<Task> getCriteria() {
        return new Specification<Task>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<TaskPermission> subquery = query.subquery(TaskPermission.class);
                    Root<TaskPermission> subRoot = subquery.from(TaskPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.or(
                                            cb.and(cb.equal(subRoot.get("task"), root), cb.equal(subRoot.get("permissionKind"), 1)),
                                            cb.and(cb.equal(subRoot.get("task"), root.get("parent")), cb.equal(subRoot.get("permissionKind"), 1)),
                                            cb.and(cb.equal(subRoot.get("project"), root.get("project")), cb.equal(subRoot.get("permissionKind"), 2))
                                    )
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getState() != null) {
                    predicates.add(cb.equal(root.get("state"), getState()));
                }
                if (getProjectId() != null) {
                    Join<Task, Project> joinProject = root.join("project", JoinType.INNER);
                    predicates.add(cb.equal(joinProject.get("id"), getProjectId()));
                }
                if (getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getParentId() != null) {
                    Join<Task, Task> joinTask = root.join("parent", JoinType.INNER);
                    predicates.add(cb.equal(joinTask.get("id"), getParentId()));
                }
                if (FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE.equals(getIgnoreProject())) {
                    predicates.add(cb.isNull(root.get("project")));
                }
                if (FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE.equals(getIgnoreParent())) {
                    predicates.add(cb.isNull(root.get("parent")));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    }else{
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                if (getTaskIds() != null && !getTaskIds().isEmpty()) {
                    predicates.add(root.get("id").in(getTaskIds()));
                }
                if (getOrganizationId() != null) {
                    Join<Task, Project> joinProject = root.join("project", JoinType.INNER);
                    predicates.add(cb.equal(joinProject.get("organization").get("id"), getOrganizationId()));
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
