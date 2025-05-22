package sample.template;

import java.util.Arrays;

public class QuickSort extends SortingAlgorithm {
	private int[] arr;

	@Override
	protected void initialize(int[] arr) {
		this.arr = Arrays.copyOf(arr, arr.length);
	}

	@Override
	protected void performSort(int[] arr) {
		System.out.println("Quick Sort:");
		quickSort(this.arr, 0, this.arr.length - 1);
	}

	private void quickSort(int[] A, int l, int r) {
		int i = l;
		int j = r;
		int x = A[l];
		int temp = 0;
		while (i < j) {
			while (A[i] < x)
				i++;
			while (A[j] > x)
				j--;
			if (i <= j) {
				temp = A[i];
				A[i] = A[j];
				A[j] = temp;

				printResult(A);

				i++;
				j--;
			}
		}
		if (l < j)
			quickSort(A, l, j);
		if (i < r)
			quickSort(A, i, r);
	}

	@Override
	protected void printResult(int[] arr) {
		for (int i : arr) {
			System.out.print(i + " ");
		}
		System.out.println();
	}
}