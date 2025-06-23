package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class AccountCriteria implements Serializable{
    private Long id;
    private Integer kind;
    private String username;
    private String phone;
    private String email;
    private String fullName;
    private Integer status;
    private Long groupId;
    private Long departmentId;
    private Date birthDate;
    private String address;
    private Long transactionId;
    private Long debitId;
    private Long keyInformationId;
    private Long taskId;
    private Long serviceId;
    private Integer sortDate;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private Long ignoreNotificationGroupId;
    private Long ignoreTransactionId;
    private Long ignoreTransactionGroupId;
    private Long ignoreTaskId;
    private Long ignoreProjectId;
    private Long ignoreKeyInformationId;
    private Long ignoreKeyInformationGroupId;
    private Long ignoreOrganizationId;
    private Long ignoreServiceId;
    private Long ignoreServiceGroupId;
    private Long ignoreChatRoomId;
    private Integer ignoreDirectMessageChatRoom = FinanceConstant.BOOLEAN_FALSE;
    private Integer ignoreCurrentUser = FinanceConstant.BOOLEAN_FALSE;
    @ApiModelProperty(hidden = true)
    private Long ignoreCurrentUserId;

    public Specification<Account> getCriteria() {
        return new Specification<Account>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<Account> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getKeyInformationId() != null) {
                    Subquery<Long> groupIdSubquery = query.subquery(Long.class);
                    Root<KeyInformation> keyInfoRoot = groupIdSubquery.from(KeyInformation.class);
                    groupIdSubquery.select(keyInfoRoot.get("keyInformationGroup").get("id")).where(cb.equal(keyInfoRoot.get("id"), getKeyInformationId()));
                    Subquery<KeyInformationPermission> accountIdSubquery = query.subquery(KeyInformationPermission.class);
                    Root<KeyInformationPermission> permissionRoot = accountIdSubquery.from(KeyInformationPermission.class);
                    accountIdSubquery.select(permissionRoot.get("account").get("id"))
                            .where(cb.or(
                                cb.and(cb.equal(permissionRoot.get("keyInformation").get("id"), getKeyInformationId()), cb.equal(permissionRoot.get("permissionKind"), 1)),
                                cb.and(permissionRoot.get("keyInformationGroup").get("id").in(groupIdSubquery), cb.equal(permissionRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(root.get("id").in(accountIdSubquery));
                }
                if (getTaskId() != null) {
                    Subquery<Long> projectIdSubquery = query.subquery(Long.class);
                    Subquery<Long> parentIdSubquery = query.subquery(Long.class);
                    Root<Task> taskRootProject = projectIdSubquery.from(Task.class);
                    Root<Task> taskRootParent = parentIdSubquery.from(Task.class);
                    projectIdSubquery.select(taskRootProject.get("project").get("id")).where(cb.equal(taskRootProject.get("id"), getTaskId()));
                    parentIdSubquery.select(taskRootParent.get("parent").get("id")).where(cb.equal(taskRootParent.get("id"), getTaskId()));
                    Subquery<TaskPermission> taskPermissionSubquery = query.subquery(TaskPermission.class);
                    Root<TaskPermission> taskPermRoot = taskPermissionSubquery.from(TaskPermission.class);
                    taskPermissionSubquery.select(taskPermRoot.get("account").get("id"))
                            .where(cb.or(
                                    cb.and(cb.equal(taskPermRoot.get("task").get("id"), getTaskId()), cb.equal(taskPermRoot.get("permissionKind"), 1)),
                                    cb.and(taskPermRoot.get("task").get("id").in(parentIdSubquery), cb.equal(taskPermRoot.get("permissionKind"), 1)),
                                    cb.and(taskPermRoot.get("project").get("id").in(projectIdSubquery), cb.equal(taskPermRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(root.get("id").in(taskPermissionSubquery));
                }
                if (getTransactionId() != null) {
                    Subquery<Long> transactionGroupIdSubquery = query.subquery(Long.class);
                    Root<Transaction> transactionRoot = transactionGroupIdSubquery.from(Transaction.class);
                    transactionGroupIdSubquery.select(transactionRoot.get("transactionGroup").get("id")).where(cb.equal(transactionRoot.get("id"), getTransactionId()));
                    Subquery<TransactionPermission> transactionPermissionSubquery = query.subquery(TransactionPermission.class);
                    Root<TransactionPermission> transactionPermRoot = transactionPermissionSubquery.from(TransactionPermission.class);
                    transactionPermissionSubquery.select(transactionPermRoot.get("account").get("id"))
                            .where(cb.or(
                                cb.and(cb.equal(transactionPermRoot.get("transaction").get("id"), getTransactionId()), cb.equal(transactionPermRoot.get("permissionKind"), 1)),
                                cb.and(transactionPermRoot.get("transactionGroup").get("id").in(transactionGroupIdSubquery), cb.equal(transactionPermRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(root.get("id").in(transactionPermissionSubquery));
                }
                if (getDebitId() != null) {
                    Subquery<Long> transactionGroupIdSubquery = query.subquery(Long.class);
                    Subquery<Long> transactionIdSubquery = query.subquery(Long.class);
                    Root<Debit> debitRootTransactionGroup = transactionGroupIdSubquery.from(Debit.class);
                    Root<Debit> debitRootTransaction = transactionIdSubquery.from(Debit.class);
                    transactionGroupIdSubquery.select(debitRootTransactionGroup.get("transactionGroup").get("id")).where(cb.equal(debitRootTransactionGroup.get("id"), getDebitId()));
                    transactionIdSubquery.select(debitRootTransaction.get("transaction").get("id")).where(cb.equal(debitRootTransaction.get("id"), getDebitId()));
                    Subquery<TransactionPermission> transactionPermissionSubquery = query.subquery(TransactionPermission.class);
                    Root<TransactionPermission> transactionPermRoot = transactionPermissionSubquery.from(TransactionPermission.class);
                    transactionPermissionSubquery.select(transactionPermRoot.get("account").get("id"))
                            .where(cb.or(
                                    cb.and(transactionPermRoot.get("transaction").get("id").in(transactionIdSubquery), cb.equal(transactionPermRoot.get("permissionKind"), 1)),
                                    cb.and(transactionPermRoot.get("transactionGroup").get("id").in(transactionGroupIdSubquery), cb.equal(transactionPermRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(root.get("id").in(transactionPermissionSubquery));
                }
                if (getServiceId() != null) {
                    Subquery<Long> serviceGroupIdSubquery = query.subquery(Long.class);
                    Root<Service> serviceRoot = serviceGroupIdSubquery.from(Service.class);
                    serviceGroupIdSubquery.select(serviceRoot.get("serviceGroup").get("id")).where(cb.equal(serviceRoot.get("id"), getServiceId()));
                    Subquery<ServicePermission> servicePermissionSubquery = query.subquery(ServicePermission.class);
                    Root<ServicePermission> servicePermRoot = servicePermissionSubquery.from(ServicePermission.class);
                    servicePermissionSubquery.select(servicePermRoot.get("account").get("id"))
                            .where(cb.or(
                                    cb.and(cb.equal(servicePermRoot.get("service").get("id"), getServiceId()), cb.equal(servicePermRoot.get("permissionKind"), 1)),
                                    cb.and(servicePermRoot.get("serviceGroup").get("id").in(serviceGroupIdSubquery), cb.equal(servicePermRoot.get("permissionKind"), 2))
                            ));
                    predicates.add(root.get("id").in(servicePermissionSubquery));
                }
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getKind() != null){
                    predicates.add(cb.equal(root.get("kind"), getKind()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if(StringUtils.isNoneBlank(getUsername())){
                    predicates.add(cb.like(cb.lower(root.get("username")), "%" + getUsername().toLowerCase() + "%"));
                }
                if(StringUtils.isNoneBlank(getPhone())){
                    predicates.add(cb.like(cb.lower(root.get("phone")), "%" + getPhone().toLowerCase() + "%"));
                }
                if(StringUtils.isNoneBlank(getEmail())){
                    predicates.add(cb.like(cb.lower(root.get("email")), "%" + getEmail().toLowerCase() + "%"));
                }
                if(StringUtils.isNoneBlank(getFullName())){
                    predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + getFullName().toLowerCase() + "%"));
                }
                if (getGroupId() != null){
                    Join<Account, Group> joinGroup = root.join("group", JoinType.INNER);
                    predicates.add(cb.equal(joinGroup.get("id"), getGroupId()));
                }
                if (getDepartmentId() != null){
                    Join<Account, Department> joinDepartment = root.join("department", JoinType.INNER);
                    predicates.add(cb.equal(joinDepartment.get("id"), getDepartmentId()));
                }
                if(StringUtils.isNoneBlank(getAddress())){
                    predicates.add(cb.like(cb.lower(root.get("address")), "%" + getAddress().toLowerCase() + "%"));
                }
                if (getBirthDate() != null) {
                    predicates.add(cb.equal(root.get("birthDate"), getBirthDate()));
                }
                if (getIgnoreNotificationGroupId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<UserGroupNotification> subRoot = subquery.from(UserGroupNotification.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("notificationGroup").get("id"), getIgnoreNotificationGroupId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreTransactionId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<TransactionPermission> subRoot = subquery.from(TransactionPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("transaction").get("id"), getIgnoreTransactionId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreTransactionGroupId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<TransactionPermission> subRoot = subquery.from(TransactionPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("transactionGroup").get("id"), getIgnoreTransactionGroupId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreTaskId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<TaskPermission> subRoot = subquery.from(TaskPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("task").get("id"), getIgnoreTaskId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreProjectId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<TaskPermission> subRoot = subquery.from(TaskPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("project").get("id"), getIgnoreProjectId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreKeyInformationId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<KeyInformationPermission> subRoot = subquery.from(KeyInformationPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("keyInformation").get("id"), getIgnoreKeyInformationId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreKeyInformationGroupId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<KeyInformationPermission> subRoot = subquery.from(KeyInformationPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("keyInformationGroup").get("id"), getIgnoreKeyInformationGroupId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreOrganizationId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<OrganizationPermission> subRoot = subquery.from(OrganizationPermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("organization").get("id"), getIgnoreOrganizationId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreServiceId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<ServicePermission> subRoot = subquery.from(ServicePermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("service").get("id"), getIgnoreServiceId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreServiceGroupId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<ServicePermission> subRoot = subquery.from(ServicePermission.class);
                    subquery.select(subRoot.get("account").get("id"))
                            .where(cb.equal(subRoot.get("serviceGroup").get("id"), getIgnoreServiceGroupId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreChatRoomId() != null) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<ChatRoomMember> subRoot = subquery.from(ChatRoomMember.class);
                    subquery.select(subRoot.get("member").get("id"))
                            .where(cb.equal(subRoot.get("chatRoom").get("id"), getIgnoreChatRoomId()));
                    predicates.add(cb.not(root.get("id").in(subquery)));
                }
                if (getIgnoreCurrentUserId() != null && FinanceConstant.BOOLEAN_TRUE.equals(getIgnoreDirectMessageChatRoom())) {
                    Subquery<Long> directChatRoomIdsSubquery = query.subquery(Long.class);
                    Root<ChatRoomMember> crm1 = directChatRoomIdsSubquery.from(ChatRoomMember.class);
                    Join<ChatRoomMember, ChatRoom> joinRoom1 = crm1.join("chatRoom", JoinType.INNER);
                    directChatRoomIdsSubquery.select(joinRoom1.get("id")).where(
                            cb.and(
                                    cb.equal(joinRoom1.get("kind"), FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE),
                                    cb.equal(crm1.get("member").get("id"), getIgnoreCurrentUserId())
                            )
                    );
                    Subquery<Long> pairedAccountIdsSubquery = query.subquery(Long.class);
                    Root<ChatRoomMember> crm2 = pairedAccountIdsSubquery.from(ChatRoomMember.class);
                    pairedAccountIdsSubquery.select(crm2.get("member").get("id")).where(
                            cb.and(
                                    crm2.get("chatRoom").get("id").in(directChatRoomIdsSubquery),
                                    cb.notEqual(crm2.get("member").get("id"), getIgnoreCurrentUserId())
                            )
                    );
                    predicates.add(cb.not(root.get("id").in(pairedAccountIdsSubquery)));
                }
                if (getIgnoreCurrentUserId() != null && FinanceConstant.BOOLEAN_TRUE.equals(getIgnoreCurrentUser())) {
                    predicates.add(cb.notEqual(root.get("id"), getIgnoreCurrentUserId()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    }else{
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
