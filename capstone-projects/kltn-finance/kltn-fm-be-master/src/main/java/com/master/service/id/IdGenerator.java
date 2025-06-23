package com.master.service.id;

import com.master.model.ReuseId;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;

public class IdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws HibernateException {
        try{
            ReuseId reuseId = (ReuseId) o;
            if(reuseId.getReusedId()!=null){
                return reuseId.getReusedId();
            }
        }catch (Exception e){
            //e.printStackTrace();
        }
        return SnowFlakeIdService.getInstance().nextId();
    }

    public Long nextId(){
        return SnowFlakeIdService.getInstance().nextId();
    }
}

