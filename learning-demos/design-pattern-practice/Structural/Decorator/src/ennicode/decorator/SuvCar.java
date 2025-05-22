package ennicode.decorator;

class SuvCar implements Car {
	@Override
	public void manufacture() {
		System.out.print("Manufacturing defalt SUV car ");
	}
}