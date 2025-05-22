package abstract_factory.model;

import abstract_factory.utils.*;

public class HotMilk implements Product {

	private Customization cust;
	private Preparation prep;

	public HotMilk(Customization cust) {
		this.cust = cust;
		this.prep = new Preparation();
	}

	@Override
	public void make() {
		this.setMilk(cust.extraMilk);
		System.out.println("\nĐã pha chế Sữa:");
		System.out.println("- Lượng sữa: " + this.prep.milk);
	}

	public void setMilk(double num) {
		prep.milk = num;
	}
}
