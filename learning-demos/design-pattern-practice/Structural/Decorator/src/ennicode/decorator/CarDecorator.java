package ennicode.decorator;

abstract class CarDecorator implements Car {
	protected Car car;

	public CarDecorator(Car car) {
		this.car = car;
	}

	@Override
	public void manufacture() {
		car.manufacture();
	}
}