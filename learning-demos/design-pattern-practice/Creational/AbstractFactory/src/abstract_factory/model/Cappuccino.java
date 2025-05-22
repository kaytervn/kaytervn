package abstract_factory.model;

import abstract_factory.utils.*;


public class Cappuccino implements Product {

	private Customization cust;
	private Preparation prep;

	public Cappuccino(Customization cust) {
		this.cust = cust;
		this.prep = new Preparation();
	}

	@Override
	public void make() {
		this.setMilk(cust.extraMilk);
		this.setSugar(cust.sugar);
		this.setCoffee(1.5);
		System.out.println("\nĐã pha chế Cappuccino:");
		System.out.println("- Lượng sữa: " + this.prep.milk);
		System.out.println("- Lượng đường: " + this.prep.sugar);
		System.out.println("- Lượng cà phê: " + this.prep.liquidCoffee);
	}

	public void setMilk(double num) {
		prep.milk = num;
	}

	public void setSugar(double num) {
		prep.sugar = num;
	}

	public void setCoffee(double num) {
		prep.liquidCoffee = num;
	}
}
