package personal.visitor;

public interface TravelVisitor{
	void visitRestaurant(Restaurant restaurant);
	void visitZoo(Zoo zoo);
	void visitBarbershop(Barbershop barbershop);
}