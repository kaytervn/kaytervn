package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.sequence.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
