package personal.strategy;

public class Main {
	public static void main(String[] args) {
		Transportation trans = new Transportation();

		trans.addParcel(new Parcel("Laptop", 3));
		trans.addParcel(new Parcel("TV", 20));
		trans.addParcel(new Parcel("Sofa", 40));
		trans.addParcel(new Parcel("Fridge", 100));
		trans.addParcel(new Parcel("Washing Machine", 80));

		trans.setTransportStrategy(new MotobikeStrategy());
		trans.transport();

		trans.setTransportStrategy(new CarStrategy());
		trans.transport();

		trans.setTransportStrategy(new TruckStrategy());
		trans.transport();
	}
}