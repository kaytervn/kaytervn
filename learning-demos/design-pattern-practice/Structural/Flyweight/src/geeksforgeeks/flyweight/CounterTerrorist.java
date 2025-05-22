package geeksforgeeks.flyweight;

// CounterTerrorist must have weapon and mission
class CounterTerrorist implements Player {
	// Intrinsic Attribute
	private final String TASK;

	// Extrinsic Attribute
	private String weapon;

	public CounterTerrorist() {
		TASK = "DIFFUSE BOMB";
	}

	public void assignWeapon(String weapon) {
		this.weapon = weapon;
	}

	public void mission() {
		System.out.println("Counter Terrorist with weapon " + weapon + "|" + " Task is " + TASK);
	}
}