package javadesignpatterns.facade;

public class DwarvenCartOperator extends DwarvenMineWorker {

	@Override
	public void work() {
		System.out.println(name() + " moves gold chunks out of the mine.");
	}

	@Override
	public String name() {
		return "Dwarf cart operator";
	}
}