package ennicode.decorator;

class BumperDecorator extends CarDecorator {
	public BumperDecorator(Car car) {
		super(car);
	}

	@Override
	public void manufacture() {
		car.manufacture();
		addBumper(car);
	}

	public void addBumper(Car car) {
		System.out.print("Adding Bumper to car ");
	}
}