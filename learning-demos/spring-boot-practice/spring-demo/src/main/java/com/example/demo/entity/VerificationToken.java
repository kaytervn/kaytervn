package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Calendar;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "verification_tokens")
public class VerificationToken extends AbstractEntity {
    String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    User user;

    Date expiryDate;

    @PrePersist
    protected void onCreate() {
        this.expiryDate = calculateExpiryDate();
    }

    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(this.getCreatedAt() != null ? this.getCreatedAt() : new Date());
        cal.add(Calendar.HOUR, 24);
        return new Date(cal.getTime().getTime());
    }

    public void resetExpiryDate() {
        this.expiryDate = calculateExpiryDate();
    }

    public boolean isExpired() {
        return new Date().after(expiryDate);
    }
}