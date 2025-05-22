package personal.cor;

public class Main {

	public static void main(String[] args) {
		TourGuide.getTransport().handleDepart(new TravelRequest(5));
		TourGuide.getTransport().handleDepart(new TravelRequest(10));
		TourGuide.getTransport().handleDepart(new TravelRequest(97));
	}
}