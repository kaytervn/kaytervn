package personal.visitor;

import java.util.ArrayList;
import java.util.List;

public class Main {

	public static void main(String[] args) {
		List<String> foods = new ArrayList<>();
		foods.add("Pizza");
		foods.add("Burger");
		foods.add("Sushi");

		List<String> areas = new ArrayList<>();
		areas.add("Mamal");
		areas.add("Reptile");
		areas.add("Insect");

		List<String> hairstyles = new ArrayList<>();
		hairstyles.add("Undercut");
		hairstyles.add("Layered");
		hairstyles.add("Dreadlocks");

		Restaurant restaurant = new Restaurant("370 Grandfield", foods);
		Zoo zoo = new Zoo("Saigon Zoo & Botanical Garden", areas);
		Barbershop barbershop = new Barbershop("The Grooming Lounge", hairstyles);

		TravelVisitor approach = new Approach();
		TravelVisitor takeAction = new TakeAction();

		zoo.accept(approach);
		zoo.accept(takeAction);

		System.out.println("---");

		restaurant.accept(approach);
		restaurant.accept(takeAction);

		System.out.println("---");

		barbershop.accept(approach);
		barbershop.accept(takeAction);
	}
}
