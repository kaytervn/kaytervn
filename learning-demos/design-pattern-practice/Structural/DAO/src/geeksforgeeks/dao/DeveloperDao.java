package geeksforgeeks.dao;

import java.util.List;

interface DeveloperDao {
	public List<Developer> getAllDevelopers();

	public Developer getDeveloper(int DeveloperId);

	public void updateDeveloper(Developer Developer);

	public void deleteDeveloper(Developer Developer);
}