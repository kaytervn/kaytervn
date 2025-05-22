package ennicode.decorator;

class HatchBackCar implements Car {
	@Override
	public void manufacture() {
		System.out.print("Manufacturing defalt HatchBack car ");
	}
}