package abstract_factory.model;

import abstract_factory.utils.*;

public class CocaCola implements Product {

	private Customization cust;
	private Preparation prep;

	public CocaCola(Customization cust) {
		this.cust = cust;
		this.prep = new Preparation();
	}

	@Override
	public void make() {
		this.setWater(cust.mugSize);
		this.setCoke(2.5);
		System.out.println("\nĐã pha chế CocaCola:");
		System.out.println("- Lượng nước: " + this.prep.water);
		System.out.println("- Lượng coke: " + this.prep.coke);
	}

	public void setWater(double num) {
		prep.water = num;
	}

	public void setCoke(double num) {
		prep.coke = num;
	}
}
