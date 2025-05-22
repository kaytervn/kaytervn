package javatpoint.mvc;

// class which represent the controller  
public class EmployeeController {

	// declaring the variables model and view
	private Employee model;
	private EmployeeView view;

	// constructor to initialize
	public EmployeeController(Employee model, EmployeeView view) {
		this.model = model;
		this.view = view;
	}

	// getter and setter methods
	public void setEmployeeName(String name) {
		model.setName(name);
	}

	public String getEmployeeName() {
		return model.getName();
	}

	public void setEmployeeId(String id) {
		model.setId(id);
	}

	public String getEmployeeId() {
		return model.getId();
	}

	public void setEmployeeDepartment(String Department) {
		model.setDepartment(Department);
	}

	public String getEmployeeDepartment() {
		return model.getDepartment();
	}

	// method to update view
	public void updateView() {
		view.printEmployeeDetails(model.getName(), model.getId(), model.getDepartment());
	}
}