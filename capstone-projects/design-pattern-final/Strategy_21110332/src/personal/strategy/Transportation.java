package personal.strategy;

import java.util.ArrayList;
import java.util.List;

public class Transportation {
	private List<Parcel> parcels;
	private TransportStrategy transportStrategy;

	public Transportation() {
		this.parcels = new ArrayList<>();
	}

	public void addParcel(Parcel parcel) {
		parcels.add(parcel);
	}

	public void transport() {
		int weight = 0;
		for (Parcel parcel : parcels) {
			weight += parcel.getWeight();
		}
		transportStrategy.transport(weight);
	}

	public void setTransportStrategy(TransportStrategy transportStrategy) {
		this.transportStrategy = transportStrategy;
	}
}