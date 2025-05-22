package sample.iterator;

public interface Iterable<T> {
	Iterator<T> createIterator();
}