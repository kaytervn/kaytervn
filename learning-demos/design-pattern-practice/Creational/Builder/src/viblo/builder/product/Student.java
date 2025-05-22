package viblo.builder.product;

// Product 
public class Student {
	private String id;
	private String firstName;
	private String lastName;
	private String dayOfBirth;
	private String currentClass;
	private String phone;

	public Student(String id, String firstName, String lastName, String dayOfBirth, String currentClass, String phone) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.dayOfBirth = dayOfBirth;
		this.currentClass = currentClass;
		this.phone = phone;
	}
}