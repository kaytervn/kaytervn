package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.identity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
