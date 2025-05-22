package ennicode.decorator;

class DashBoardMeterDecorator extends CarDecorator {
	public DashBoardMeterDecorator(Car car) {
		super(car);
	}

	@Override
	public void manufacture() {
		car.manufacture();
		addDashBoardMeter(car);
	}

	public void addDashBoardMeter(Car car) {
		System.out.print("Adding Extra DashBoard Meters to car ");
	}

}