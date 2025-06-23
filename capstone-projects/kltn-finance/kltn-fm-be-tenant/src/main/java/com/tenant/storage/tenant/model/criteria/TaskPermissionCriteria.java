package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class TaskPermissionCriteria {
    private Long id;
    private Integer status;
    private Integer permissionKind;
    private Long accountId;
    private Long taskId;
    private Long projectId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE;

    public Specification<TaskPermission> getCriteria() {
        return new Specification<TaskPermission>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<TaskPermission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if(getPermissionKind() != null){
                    predicates.add(cb.equal(root.get("permissionKind"), getPermissionKind()));
                }
                if (getAccountId() != null){
                    Join<TaskPermission, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getTaskId() != null){
                    Join<TaskPermission, Task> joinTask = root.join("task", JoinType.INNER);
                    predicates.add(cb.equal(joinTask.get("id"), getTaskId()));
                }
                if (getProjectId() != null){
                    Join<TaskPermission, Project> joinProject = root.join("project", JoinType.INNER);
                    predicates.add(cb.equal(joinProject.get("id"), getProjectId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
