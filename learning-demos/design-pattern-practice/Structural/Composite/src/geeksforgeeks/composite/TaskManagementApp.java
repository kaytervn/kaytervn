package geeksforgeeks.composite;

// Client

public class TaskManagementApp {
	public static void main(String[] args) {
		// Creating simple tasks
		Task simpleTask1 = new SimpleTask("Complete Coding");
		Task simpleTask2 = new SimpleTask("Write Documentation");

		// Creating a task list
		TaskList projectTasks = new TaskList("Project Tasks");
		projectTasks.addTask(simpleTask1);
		projectTasks.addTask(simpleTask2);

		// Nested task list
		TaskList phase1Tasks = new TaskList("Phase 1 Tasks");
		phase1Tasks.addTask(new SimpleTask("Design"));
		phase1Tasks.addTask(new SimpleTask("Implementation"));

		projectTasks.addTask(phase1Tasks);

		// Displaying tasks
		projectTasks.display();
	}
}
