package geeksforgeeks.abstractfactory;

// Concrete Factory for North America Cars
class NorthAmericaCarFactory implements CarFactory {
	public Car createCar() {
		return new Sedan();
	}

	public CarSpecification createSpecification() {
		return new NorthAmericaSpecification();
	}
}