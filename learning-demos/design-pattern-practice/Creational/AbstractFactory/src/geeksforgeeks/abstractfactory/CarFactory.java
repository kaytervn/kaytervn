package geeksforgeeks.abstractfactory;

// Abstract Factory Interface
interface CarFactory {
	Car createCar();

	CarSpecification createSpecification();
}
