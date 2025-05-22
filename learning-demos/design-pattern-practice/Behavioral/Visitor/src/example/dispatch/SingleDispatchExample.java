package example.dispatch;

// Lớp cơ sở
class Animal {
	public void speak() {
		System.out.println("Some generic animal sound");
	}
}

// Lớp con
class Dog extends Animal {
	@Override
	public void speak() {
		System.out.println("Bark");
	}
}

class Cat extends Animal {
	@Override
	public void speak() {
		System.out.println("Meow");
	}
}

public class SingleDispatchExample {
	public static void main(String[] args) {
		Animal[] animals = { new Dog(), new Cat(), new Animal() };

		for (Animal animal : animals) {
			animal.speak(); // Kết quả: Bark, Meow, Some generic animal sound
		}
	}
}