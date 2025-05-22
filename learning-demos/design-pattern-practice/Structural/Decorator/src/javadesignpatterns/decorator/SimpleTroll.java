package javadesignpatterns.decorator;

public class SimpleTroll implements Troll {

	@Override
	public void attack() {
		System.out.println("The troll tries to grab you!");
	}

	@Override
	public int getAttackPower() {
		return 10;
	}

	@Override
	public void fleeBattle() {
		System.out.println("The troll shrieks in horror and runs away!");
	}
}