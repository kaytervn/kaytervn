package abstract_factory.factory;

import abstract_factory.utils.Customization;
import abstract_factory.utils.Product;

public abstract class ProductFactory {
	public abstract Product getProduct(Customization customization);

	public static ProductFactory getProductFactory(String factoryType) {
		switch (factoryType) {
		case "cappuccino":
			return new CappuccinoFactory();
		case "blackcoffee":
			return new BlackCoffeeFactory();
		case "lemonade":
			return new LemonadeFactory();
		case "hotmilk":
			return new HotMilkFactory();
		case "cocacola":
			return new CocaColaFactory();
		default:
			throw new IllegalArgumentException("Loại nhà máy không hợp lệ: " + factoryType);
		}
	}
}