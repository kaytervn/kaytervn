package geeksforgeeks.abstractfactory;

// Concrete Factory for Europe Cars
class EuropeCarFactory implements CarFactory {
	public Car createCar() {
		return new Hatchback();
	}

	public CarSpecification createSpecification() {
		return new EuropeSpecification();
	}
}