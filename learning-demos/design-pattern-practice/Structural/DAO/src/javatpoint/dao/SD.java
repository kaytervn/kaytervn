package javatpoint.dao;

import java.util.List;

public interface SD {
	public List<S> getAllStudents();

	public S getStudent(int r);

	public void updateStudent(S s);

	public void deleteStudent(S s);
}