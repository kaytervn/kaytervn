package sample.template;

import java.util.Arrays;

public class BubbleSort extends SortingAlgorithm {
	private int[] arr;

	@Override
	protected void initialize(int[] arr) {
		this.arr = Arrays.copyOf(arr, arr.length);
	}

	@Override
	protected void performSort(int[] arr) {
		System.out.println("Bubble Sort:");
		bubbleSort(this.arr);
	}

	private void bubbleSort(int[] arr) {
		int n = arr.length;
		for (int i = 0; i < n - 1; i++) {
			for (int j = 0; j < n - i - 1; j++) {
				if (arr[j] > arr[j + 1]) {
					int temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
					printResult(arr);
				}
			}
		}
	}

	@Override
	protected void printResult(int[] arr) {
		for (int i : arr) {
			System.out.print(i + " ");
		}
		System.out.println();
	}
}