package abstract_factory.factory;

import abstract_factory.model.Cappuccino;
import abstract_factory.utils.Customization;
import abstract_factory.utils.Product;

public class CappuccinoFactory extends ProductFactory {

	@Override
	public Product getProduct(Customization cust) {
		return new Cappuccino(cust);
	}

}