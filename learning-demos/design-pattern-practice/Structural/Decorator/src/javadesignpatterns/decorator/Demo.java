package javadesignpatterns.decorator;

public class Demo {

	public static void main(String[] args) {
		// simple troll
		System.out.println("A simple looking troll approaches.");
		var troll = new SimpleTroll();
		troll.attack();
		troll.fleeBattle();
		System.out.println("Simple troll power: " + troll.getAttackPower());

		System.out.println("A troll with huge club surprises you.");
		var clubbedTroll = new ClubbedTroll(troll);
		clubbedTroll.attack();
		clubbedTroll.fleeBattle();
		System.out.println("Clubbed troll power: " + clubbedTroll.getAttackPower());

	}

}
