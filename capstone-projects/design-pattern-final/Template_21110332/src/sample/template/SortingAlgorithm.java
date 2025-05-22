package sample.template;

public abstract class SortingAlgorithm {
	public void sort(int[] arr) {
		initialize(arr);
		performSort(arr);
	}

	protected abstract void initialize(int[] arr);

	protected abstract void performSort(int[] arr);

	protected abstract void printResult(int[] arr);
}