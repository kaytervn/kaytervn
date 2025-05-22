package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.table.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
