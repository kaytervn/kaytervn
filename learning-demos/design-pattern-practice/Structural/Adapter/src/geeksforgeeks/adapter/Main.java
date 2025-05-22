package geeksforgeeks.adapter;

public class Main {
	public static void main(String[] args) {
		// Using the Adapter
		PrinterAdapter adapter = new PrinterAdapter();
		clientCode(adapter);
	}

	// Client Code
	public static void clientCode(Printer printer) {
		printer.print();
	}
}