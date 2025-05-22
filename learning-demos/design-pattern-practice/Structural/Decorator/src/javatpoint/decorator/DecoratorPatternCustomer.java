package javatpoint.decorator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class DecoratorPatternCustomer {
	private static int choice;

	public static void main(String args[]) throws NumberFormatException, IOException {
		do {
			System.out.print("========= Food Menu ============ \n");
			System.out.print("            1. Vegetarian Food.   \n");
			System.out.print("            2. Non-Vegetarian Food.\n");
			System.out.print("            3. Chineese Food.         \n");
			System.out.print("            4. Exit                        \n");
			System.out.print("Enter your choice: ");
			BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
			choice = Integer.parseInt(br.readLine());
			switch (choice) {
			case 1: {
				VegFood vf = new VegFood();
				System.out.println(vf.prepareFood());
				System.out.println(vf.foodPrice());
			}
				break;

			case 2: {
				Food f1 = new NonVegFood((Food) new VegFood());
				System.out.println(f1.prepareFood());
				System.out.println(f1.foodPrice());
			}
				break;
			case 3: {
				Food f2 = new ChineseFood((Food) new VegFood());
				System.out.println(f2.prepareFood());
				System.out.println(f2.foodPrice());
			}
				break;

			default: {
				System.out.println("Other than these no food available");
			}
				return;
			}// end of switch

		} while (choice != 4);
	}
}