package personal.visitor;

public class TakeAction implements TravelVisitor {

	@Override
	public void visitRestaurant(Restaurant restaurant) {
		System.out.println("Open the menu:");
		for (String item : restaurant.foods) {
			System.out.println("- " + item);
		}
	}

	@Override
	public void visitZoo(Zoo zoo) {
		System.out.println("View the map:");
		for (String item : zoo.areas) {
			System.out.println("- " + item);
		}
	}

	@Override
	public void visitBarbershop(Barbershop barbershop) {
		System.out.println("Choose hairstyle:");
		for (String item : barbershop.hairstyles) {
			System.out.println("- " + item);
		}
	}
}
