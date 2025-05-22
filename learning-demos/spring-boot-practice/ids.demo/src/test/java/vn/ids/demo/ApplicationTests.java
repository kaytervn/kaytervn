package vn.ids.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import vn.ids.demo.auto.Student;
import vn.ids.demo.custom.Product;
import vn.ids.demo.identity.Employee;
import vn.ids.demo.repository.*;
import vn.ids.demo.sequence.User;
import vn.ids.demo.table.Department;
import vn.ids.demo.uuid.Course;

@SpringBootTest
class ApplicationTests {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void studentTest() {
        studentRepository.save(new Student("Student 3"));
        studentRepository.save(new Student("Student 4"));
        studentRepository.save(new Student("Student 5"));
        studentRepository.save(new Student("Student 6"));
    }

    @Test
    public void userTest() {
        userRepository.save(new User("User 3"));
        userRepository.save(new User("User 4"));
        userRepository.save(new User("User 5"));
        userRepository.save(new User("User 6"));
    }

    @Test
    public void employeeTest() {
        employeeRepository.save(new Employee("Employee 3"));
        employeeRepository.save(new Employee("Employee 4"));
        employeeRepository.save(new Employee("Employee 5"));
        employeeRepository.save(new Employee("Employee 6"));
        employeeRepository.save(new Employee("Employee 7"));
    }

    @Test
    public void departmentTest() {
        departmentRepository.save(new Department("Department 1"));
        departmentRepository.save(new Department("Department 2"));
        departmentRepository.save(new Department("Department 3"));
        departmentRepository.save(new Department("Department 4"));
        departmentRepository.save(new Department("Department 5"));
        departmentRepository.save(new Department("Department 6"));
        departmentRepository.save(new Department("Department 7"));
        departmentRepository.save(new Department("Department 8"));
    }

    @Test
    public void courseTest() {
        courseRepository.save(new Course("Course 1"));
        courseRepository.save(new Course("Course 2"));
        courseRepository.save(new Course("Course 3"));
        courseRepository.save(new Course("Course 4"));
        courseRepository.save(new Course("Course 5"));
        courseRepository.save(new Course("Course 6"));
        courseRepository.save(new Course("Course 7"));
        courseRepository.save(new Course("Course 8"));
    }

    @Test
    public void productTest() {
        productRepository.save(new Product("Product 1"));
        productRepository.save(new Product("Product 2"));
        productRepository.save(new Product("Product 3"));
        productRepository.save(new Product("Product 4"));
        productRepository.save(new Product("Product 5"));
        productRepository.save(new Product("Product 6"));
        productRepository.save(new Product("Product 7"));
        productRepository.save(new Product("Product 8"));
        productRepository.save(new Product("Product 9"));
    }

}
