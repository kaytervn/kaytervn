package personal.iterator;

import java.util.ArrayList;
import java.util.List;

public class Main {
	public static void main(String[] args) {
		List<Planet> planets = new ArrayList<>();
		planets.add(new Planet("Mercury"));
		planets.add(new Planet("Venus"));
		planets.add(new Planet("Earth"));
		planets.add(new Planet("Mars"));
		planets.add(new Planet("Jupiter"));
		planets.add(new Planet("Saturn"));
		planets.add(new Planet("Uranus"));
		planets.add(new Planet("Neptune"));

		SolarSystem solarSystem = new SolarSystem(planets);
		Iterator<Planet> iterator = solarSystem.getIterator();

		while (iterator.hasNext()) {
			Planet planet = iterator.next();
			System.out.println(planet.getName());
		}
	}
}