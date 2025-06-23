package com.tenant.storage.tenant.model;

import com.tenant.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.*;
import javax.persistence.*;

@Entity
@Table(name = "db_fn_message")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Message extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.tenant.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_Id")
    private Account sender;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String document;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Message parent;
    private Boolean isUpdate = false;
    private Boolean isDeleted = false;
    @OneToMany(mappedBy = "message", fetch = FetchType.LAZY)
    private List<MessageReaction> messageReactions = new ArrayList<>();
    @OneToMany(mappedBy = "lastReadMessage", fetch = FetchType.LAZY)
    List<ChatRoomMember> seenMembers = new ArrayList<>();
}
