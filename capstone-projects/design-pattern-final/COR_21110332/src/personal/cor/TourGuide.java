package personal.cor;

public class TourGuide {

	public static TransportHandler getTransport() {
		TransportHandler car = new Car();
		TransportHandler bus = new Bus();
		TransportHandler airplane = new Airplane();

		car.setNext(bus);
		bus.setNext(airplane);
		return car;
	}
}