package javatpoint.singleton.eagerinit;

public class SingletonDemo {
	public static void main(String[] args) {
		Singleton singleton1 = Singleton.getInstance();
		Singleton singleton2 = Singleton.getInstance();
		if (singleton1 == singleton2) {
			System.out.println("Both objects are the same instance.");
		}
	}
}