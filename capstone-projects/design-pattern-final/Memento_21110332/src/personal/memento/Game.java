package personal.memento;

public class Game {
	private int health;
	private int score;
	private int level;

	public Game() {
		this.health = 100;
		this.score = 0;
		this.level = 1;
	}

	public void play() {
		System.out.println("Playing the game...");
		health -= 10;
		score += 10;
		level += 1;
	}

	public GameMemento saveState() {
		return new GameMemento(health, score, level);
	}

	public void restoreState(GameMemento memento) {
		health = memento.getHealth();
		score = memento.getScore();
		level = memento.getLevel();
	}

	public void printState() {
		System.out.println("Health: " + health + ", Score: " + score + ", Level: " + level);
	}
}