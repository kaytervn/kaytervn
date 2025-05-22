package example.dispatch;

// Lớp vũ khí
class Weapon {
	public void attack(Character target) {
		target.receiveAttack(this);
	}
}

class Sword extends Weapon {
}

class Bow extends Weapon {
}

// Lớp nhân vật
class Character {
	public void receiveAttack(Weapon weapon) {
		System.out.println("Character is attacked with a weapon");
	}
}

class Knight extends Character {
	@Override
	public void receiveAttack(Weapon weapon) {
		if (weapon instanceof Sword) {
			System.out.println("Knight is hit by a sword");
		} else if (weapon instanceof Bow) {
			System.out.println("Knight is hit by an arrow");
		} else {
			super.receiveAttack(weapon);
		}
	}
}

// Triển khai Double Dispatch
public class DoubleDispatchExample {
	public static void main(String[] args) {
		Knight knight = new Knight();
		Sword sword = new Sword();
		Bow bow = new Bow();

		sword.attack(knight); // Kết quả: Knight is hit by a sword
		bow.attack(knight); // Kết quả: Knight is hit by an arrow
	}
}