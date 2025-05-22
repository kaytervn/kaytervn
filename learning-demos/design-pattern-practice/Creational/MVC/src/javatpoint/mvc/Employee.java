package javatpoint.mvc;

// class that represents model  
public class Employee {

	// declaring the variables
	private String EmployeeName;
	private String EmployeeId;
	private String EmployeeDepartment;

	// defining getter and setter methods
	public String getId() {
		return EmployeeId;
	}

	public void setId(String id) {
		this.EmployeeId = id;
	}

	public String getName() {
		return EmployeeName;
	}

	public void setName(String name) {
		this.EmployeeName = name;
	}

	public String getDepartment() {
		return EmployeeDepartment;
	}

	public void setDepartment(String Department) {
		this.EmployeeDepartment = Department;
	}

}