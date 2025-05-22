package personal.visitor;

import java.util.List;

public class Barbershop implements Destination {

	String brand;
	List<String> hairstyles;

	public Barbershop(String brand, List<String> hairstyles) {
		super();
		this.brand = brand;
		this.hairstyles = hairstyles;
	}

	@Override
	public void accept(TravelVisitor visitor) {
		visitor.visitBarbershop(this);
	}
}
