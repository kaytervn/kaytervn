package personal.template;

public class Main {
	public static void main(String[] args) {
		System.out.println("Making a pizza:");
		RecipeTemplate pizzaRecipe = new PizzaRecipe();
		pizzaRecipe.makeRecipe();

		System.out.println("---");

		System.out.println("Making a salad:");
		RecipeTemplate saladRecipe = new SaladRecipe();
		saladRecipe.makeRecipe();
	}
}