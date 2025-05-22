package personal.iterator;

import java.util.List;

public class SolarSystemIterator implements Iterator<Planet> {
	private List<Planet> planets;
	private int position;

	public SolarSystemIterator(List<Planet> planets) {
		this.planets = planets;
		position = 0;
	}

	@Override
	public boolean hasNext() {
		return position < planets.size();
	}

	@Override
	public Planet next() {
		if (!hasNext()) {
			throw new IndexOutOfBoundsException();
		}
		return planets.get(position++);
	}
}