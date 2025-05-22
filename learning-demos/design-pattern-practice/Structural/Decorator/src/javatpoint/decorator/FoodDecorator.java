package javatpoint.decorator;

public abstract class FoodDecorator implements Food {
	private Food newFood;

	public FoodDecorator(Food newFood) {
		this.newFood = newFood;
	}

	@Override
	public String prepareFood() {
		return newFood.prepareFood();
	}

	public double foodPrice() {
		return newFood.foodPrice();
	}
}