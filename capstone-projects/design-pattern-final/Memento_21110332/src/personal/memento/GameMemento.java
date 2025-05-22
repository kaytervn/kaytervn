package personal.memento;

public class GameMemento {
	private final int health;
	private final int score;
	private final int level;

	public GameMemento(int health, int score, int level) {
		this.health = health;
		this.score = score;
		this.level = level;
	}

	public int getHealth() {
		return health;
	}

	public int getScore() {
		return score;
	}

	public int getLevel() {
		return level;
	}
}