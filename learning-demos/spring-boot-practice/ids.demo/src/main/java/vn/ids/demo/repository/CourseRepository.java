package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.uuid.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
}
