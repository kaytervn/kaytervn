package com.msa.service.id;

import com.msa.storage.ReuseId;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;

public class IdGenerator implements IdentifierGenerator {
    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws HibernateException {
        ReuseId reuseId = (ReuseId) o;
        if (reuseId.getReusedId() != null) {
            return reuseId.getReusedId();
        }
        return SnowFlakeIdService.getInstance().nextId();
    }

    public Long nextId() {
        return SnowFlakeIdService.getInstance().nextId();
    }
}

