package personal.memento;

public class GameClient {
	public static void main(String[] args) {
		Game game = new Game();
		GameCaretaker caretaker = new GameCaretaker();

		game.printState();
		caretaker.saveState(game);

		game.play();
		game.printState();
		caretaker.saveState(game);

		game.play();
		game.printState();
		caretaker.saveState(game);

		caretaker.undo(game);
		System.out.println("Undoing...");
		game.printState();

		caretaker.undo(game);
		System.out.println("Undoing again...");
		game.printState();
	}
}