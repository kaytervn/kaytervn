package personal.visitor;

import java.util.List;

public class Zoo implements Destination {
	String name;
	List<String> areas;

	public Zoo(String name, List<String> areas) {
		this.name = name;
		this.areas = areas;
	}

	@Override
	public void accept(TravelVisitor visitor) {
		visitor.visitZoo(this);
	}
}
