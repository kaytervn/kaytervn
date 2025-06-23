package com.tenant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public class AbstractService<T extends JpaRepository, K> {
    @Autowired
    private T repo;

    public T getRepo() {
        return repo;
    }

    public void setRepo(T repo) {
        this.repo = repo;
    }

    @Transactional
    public K save(K k){
        return (K)repo.save(k);
    }

    @Transactional
    public void delete(K k){
        repo.delete(k);
    }

    @Transactional(readOnly = true)
    public List<K> findAll(){
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Page<K> findAll(Pageable pageable){
        return repo.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public K findById(Long id){
        Optional<K> re = repo.findById(id);
        if (re.isPresent()){
            return re.get();
        }else {
            return null;
        }
    }

    @Transactional
    public List<K> saveAll(List<K> list){
        return repo.saveAll(list);
    }
}
