package personal.visitor;

import java.util.List;

public class Restaurant implements Destination {
	String address;
	List<String> foods;

	public Restaurant(String address, List<String> foods) {
		this.address = address;
		this.foods = foods;
	}

	@Override
	public void accept(TravelVisitor visitor) {
		visitor.visitRestaurant(this);
	}
}
