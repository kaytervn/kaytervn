package javadesignpatterns.composite;

public class Demo {
	public static void main(String[] args) {
		var messenger = new Messenger();

		System.out.print("Message from the orcs: ");
		messenger.messageFromOrcs().print();

		System.out.print("\nMessage from the elves: ");
		messenger.messageFromElves().print();
	}
}