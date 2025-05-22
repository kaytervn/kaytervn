package ennicode.decorator;

class TailLightDecorator extends CarDecorator {
	public TailLightDecorator(Car car) {
		super(car);
	}

	@Override
	public void manufacture() {
		car.manufacture();
		addTailLight(car);
	}

	public void addTailLight(Car car) {
		System.out.print("Adding Extra Tail Lights to car ");
	}

}