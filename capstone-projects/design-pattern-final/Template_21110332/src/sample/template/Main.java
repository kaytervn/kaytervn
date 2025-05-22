package sample.template;

public class Main {
	public static void main(String[] args) {
		int[] arr = { 5, 8, 2, 1, 9 };

		SortingAlgorithm bubbleSort = new BubbleSort();
		bubbleSort.sort(arr);

		System.out.println("---");

		SortingAlgorithm quickSort = new QuickSort();
		quickSort.sort(arr);
	}
}