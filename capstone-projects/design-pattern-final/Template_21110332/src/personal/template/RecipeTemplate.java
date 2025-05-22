package personal.template;

public abstract class RecipeTemplate {
	public void prepareIngredients() {
		System.out.println("Preparing ingredients");
	}

	public abstract void cook();

	public void cleanUp() {
		System.out.println("Cleaning up");
	}

	public final void makeRecipe() {
		prepareIngredients();
		cook();
		cleanUp();
	}
}