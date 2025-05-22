package abstract_factory.testapp;

import abstract_factory.factory.ProductFactory;
import abstract_factory.utils.*;


public class Demo {

	public static void main(String[] args) {
		Customization c1 = new Customization();
		c1.extraMilk = 10;
		c1.sugar = 2;
		c1.mugSize = 300;

		Customization c2 = new Customization();
		c2.extraMilk = 20;
		c2.sugar = 0;
		c2.mugSize = 200;

		Customization c3 = new Customization();
		c3.extraMilk = 0;
		c3.sugar = 1;
		c3.mugSize = 400;

		ProductFactory pf1 = ProductFactory.getProductFactory("cappuccino");
		ProductFactory pf2 = ProductFactory.getProductFactory("blackcoffee");
		ProductFactory pf3 = ProductFactory.getProductFactory("lemonade");

		Product p1 = pf1.getProduct(c1);
		Product p2 = pf2.getProduct(c2);
		Product p3 = pf3.getProduct(c3);

		p1.make();
		p2.make();
		p3.make();
	}

}
