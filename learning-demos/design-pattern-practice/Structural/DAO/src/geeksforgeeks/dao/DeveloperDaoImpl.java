package geeksforgeeks.dao;

import java.util.ArrayList;
import java.util.List;

class DeveloperDaoImpl implements DeveloperDao {

	List<Developer> Developers;

	// Method 1
	public DeveloperDaoImpl() {
		Developers = new ArrayList<Developer>();
		Developer Developer1 = new Developer("Kushagra", 0);
		Developer Developer2 = new Developer("Vikram", 1);
		Developers.add(Developer1);
		Developers.add(Developer2);
	}

	// Method 2
	@Override
	public void deleteDeveloper(Developer Developer) {
		Developers.remove(Developer.getDeveloperId());
		System.out.println("DeveloperId " + Developer.getDeveloperId() + ", deleted from database");
	}

	// Method 3
	@Override
	public List<Developer> getAllDevelopers() {
		return Developers;
	}

	// Method 4
	@Override
	public Developer getDeveloper(int DeveloperId) {
		return Developers.get(DeveloperId);
	}

	// Method 5
	@Override
	public void updateDeveloper(Developer Developer) {
		Developers.get(Developer.getDeveloperId()).setName(Developer.getName());
		System.out.println("DeveloperId " + Developer.getDeveloperId() + ", updated in the database");
	}
}