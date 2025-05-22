package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.auto.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
