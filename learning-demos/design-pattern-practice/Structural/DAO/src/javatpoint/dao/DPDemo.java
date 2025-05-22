package javatpoint.dao;

public class DPDemo {
	public static void main(String[] args) {
		SD sD = new SDI();
		// print all the students
		for (S s : sD.getAllStudents()) {
			System.out.println("Student: [RollNo : " + s.getRollNo() + ", Name : " + s.getName() + " ]");
		}
		// update student
		S s = sD.getAllStudents().get(0);
		s.setName("JavaTpoint");
		sD.updateStudent(s);
		// get the student
		sD.getStudent(0);
		System.out.println("Student: [RollNo : " + s.getRollNo() + ", Name : " + s.getName() + " ]");
	}
}