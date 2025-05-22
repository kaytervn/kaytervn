package javadesignpatterns.flyweight;

public class PoisonPotion implements Potion {
	@Override
	public void drink() {
		System.out.println("You are poisoned. (Potion={" + System.identityHashCode(this) + "})");
	}
}