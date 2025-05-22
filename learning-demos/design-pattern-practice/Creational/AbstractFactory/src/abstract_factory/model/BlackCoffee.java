package abstract_factory.model;

import abstract_factory.utils.*;

public class BlackCoffee implements Product {

	private Customization cust;
	private Preparation prep;

	public BlackCoffee(Customization cust) {
		this.cust = cust;
		this.prep = new Preparation();
	}

	@Override
	public void make() {
		this.setWater(cust.mugSize);
		this.setCoffee(2);
		System.out.println("\nĐã pha chế Cà Phê Đen:");
		System.out.println("- Lượng nước: " + this.prep.water);
		System.out.println("- Lượng cà phê: " + this.prep.liquidCoffee);
	}

	public void setWater(double num) {
		prep.water = num;
	}

	public void setCoffee(double num) {
		prep.liquidCoffee = num;
	}
}
