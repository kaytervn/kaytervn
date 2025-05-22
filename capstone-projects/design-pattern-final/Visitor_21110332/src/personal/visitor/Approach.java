package personal.visitor;

public class Approach implements TravelVisitor {

	@Override
	public void visitRestaurant(Restaurant restaurant) {
		System.out.println("Arrive at the restaurant: " + restaurant.address);
	}

	@Override
	public void visitZoo(Zoo zoo) {
		System.out.println("Arrive at the zoo: " + zoo.name);
	}

	@Override
	public void visitBarbershop(Barbershop barbershop) {
		System.out.println("Arrive at the barbershop: " + barbershop.brand);
	}

}
