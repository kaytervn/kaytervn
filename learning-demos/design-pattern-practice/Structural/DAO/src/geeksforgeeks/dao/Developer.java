package geeksforgeeks.dao;

// Class 1
// Helper class
class Developer {

	private String name;
	private int DeveloperId;

	// Constructor of Developer class
	Developer(String name, int DeveloperId) {

		// This keyword refers to current instance itself
		this.name = name;
		this.DeveloperId = DeveloperId;
	}

	// Method 1
	public String getName() {
		return name;
	}

	// Method 2
	public void setName(String name) {
		this.name = name;
	}

	// Method 3
	public int getDeveloperId() {
		return DeveloperId;
	}

	// Method 4
	public void setDeveloperId(int DeveloperId) {
		this.DeveloperId = DeveloperId;
	}
}