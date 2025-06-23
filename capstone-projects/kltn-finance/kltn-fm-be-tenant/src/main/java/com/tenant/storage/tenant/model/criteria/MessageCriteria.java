package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatRoom;
import com.tenant.storage.tenant.model.Message;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ApiModel
public class MessageCriteria {
    private Long id;
    private Long senderId;
    private String content;
    private String document;
    private String parent;
    private Integer status;
    @ApiModelProperty(required = true)
    private Long chatRoomId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE;

    public Specification<Message> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getSenderId() != null) {
                Join<Message, Account> join = root.join("sender", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getSenderId()));
            }
            if (getChatRoomId() != null) {
                Join<Message, ChatRoom> join = root.join("chatRoom", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getChatRoomId()));
            }
            if (StringUtils.isNotBlank(getContent())) {
                predicates.add(cb.like(cb.lower(root.get("content")), "%" + getContent().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getDocument())) {
                predicates.add(cb.like(cb.lower(root.get("document")), "%" + getDocument().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getParent())) {
                predicates.add(cb.like(cb.lower(root.get("parent")), "%" + getParent().toLowerCase() + "%"));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(cb.desc(root.get("createdDate")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}