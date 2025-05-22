package abstract_factory.model;

import abstract_factory.utils.*;

public class Lemonade implements Product {

	private Customization cust;
	private Preparation prep;

	public Lemonade(Customization cust) {
		this.cust = cust;
		this.prep = new Preparation();
	}

	@Override
	public void make() {
		this.setWater(cust.mugSize);
		this.setLemonJuice(cust.mugSize / 4);
		System.out.println("\nĐã pha chế Nước Chanh:");
		System.out.println("- Lượng nước: " + this.prep.water);
		System.out.println("- Lượng nước cốt chanh: " + this.prep.addedFlavour);
	}

	public void setWater(double num) {
		prep.water = num;
	}

	public void setSugar(double num) {
		prep.sugar = num;
	}

	public void setLemonJuice(double num) {
		prep.addedFlavour = num;
	}
}
