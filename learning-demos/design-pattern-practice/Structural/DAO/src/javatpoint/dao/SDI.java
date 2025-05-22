package javatpoint.dao;

import java.util.ArrayList;
import java.util.List;

public class SDI implements SD {
	// list is working as the database
	List<S> ss;

	public SDI() {
		ss = new ArrayList<S>();
		S s1 = new S("Sonoo", 0);
		S s2 = new S("Jaiswal", 1);
		ss.add(s1);
		ss.add(s2);
	}

	@Override
	public void deleteStudent(S s) {
		ss.remove(s.getRollNo());
		System.out.println("Student: Roll No " + s.getRollNo() + ", has been deleted from the database");
	}

	// traversing list of students from the database
	@Override
	public List<S> getAllStudents() {
		return ss;
	}

	@Override
	public S getStudent(int r) {
		return ss.get(r);
	}

	@Override
	public void updateStudent(S s) {
		ss.get(s.getRollNo()).setName(s.getName());
		System.out.println("Student: Roll No " + s.getRollNo() + ", has been updated in the database");
	}
}