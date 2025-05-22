package javatpoint.mvc;

// class which represents the view  
public class EmployeeView {

	// method to display the Employee details
	public void printEmployeeDetails(String EmployeeName, String EmployeeId, String EmployeeDepartment) {
		System.out.println("Employee Details: ");
		System.out.println("Name: " + EmployeeName);
		System.out.println("Employee ID: " + EmployeeId);
		System.out.println("Employee Department: " + EmployeeDepartment);
	}
}