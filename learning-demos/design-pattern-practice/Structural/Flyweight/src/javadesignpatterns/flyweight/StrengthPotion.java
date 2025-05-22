package javadesignpatterns.flyweight;

public class StrengthPotion implements Potion {
	@Override
	public void drink() {
		System.out.println("You become strong. (Potion={" + System.identityHashCode(this) + "})");
	}
}