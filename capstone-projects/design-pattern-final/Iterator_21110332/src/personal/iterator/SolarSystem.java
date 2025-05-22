package personal.iterator;

import java.util.List;

public class SolarSystem implements Iterable<Planet> {
	private List<Planet> planets;

	public SolarSystem(List<Planet> planets) {
		this.planets = planets;
	}

	@Override
	public Iterator<Planet> getIterator() {
		return new SolarSystemIterator(planets);
	}
}