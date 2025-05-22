package ennicode.decorator;

public class DecoratorCarClient {
	public static void main(String[] args) {
		Car car1 = new SuvCar();
		// Manufacturing Basic SUV type car
		car1.manufacture();
		System.out.println();
		System.out.println("---------------------------------------------");
		Car car2 = new BumperDecorator(new SuvCar());
		// Manufacturing SUV type car with only addition of Bumper
		car2.manufacture();
		System.out.println();
		System.out.println("---------------------------------------------");
		Car car3 = new TailLightDecorator(new DashBoardMeterDecorator(new BumperDecorator(new SuvCar())));
		// Manufacturing SUV type car with many additionals like Bumper,
		// Tail Lights, Dashboard meters
		car3.manufacture();
		System.out.println();
		System.out.println("---------------------------------------------");
		Car car4 = new TailLightDecorator(new DashBoardMeterDecorator(new BumperDecorator(new HatchBackCar())));
		// Manufacturing HatchBack type car with many additionals like Bumper,
		// Tail Lights, Dashboard meters
		car4.manufacture();
		System.out.println();
		System.out.println("---------------------------------------------");
	}
}