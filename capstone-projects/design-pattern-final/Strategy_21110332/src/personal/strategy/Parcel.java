package personal.strategy;

public class Parcel {
	private String name;
	private int weight;

	public Parcel(String name, int weight) {
		this.name = name;
		this.weight = weight;
	}

	public String getName() {
		return name;
	}

	public int getWeight() {
		return weight;
	}
}