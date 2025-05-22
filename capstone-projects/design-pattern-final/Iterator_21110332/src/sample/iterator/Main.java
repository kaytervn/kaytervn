package sample.iterator;

public class Main {
	public static void main(String[] args) {
		Document document = new Document();
		document.addVersion(new Version("Initial version"));
		document.addVersion(new Version("Added feature X"));
		document.addVersion(new Version("Fixed bug Y"));

		Iterator<Version> iterator = document.createIterator();
		while (iterator.hasNext()) {
			Version version = iterator.next();
			System.out.println(version);
		}
	}
}