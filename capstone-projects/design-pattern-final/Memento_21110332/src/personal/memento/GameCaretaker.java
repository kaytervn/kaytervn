package personal.memento;

import java.util.ArrayList;
import java.util.List;

public class GameCaretaker {
	private final List<GameMemento> mementos = new ArrayList<>();

	public void saveState(Game game) {
		mementos.add(game.saveState());
	}

	public void undo(Game game) {
		if (!mementos.isEmpty()) {
			GameMemento memento = mementos.remove(mementos.size() - 1);
			game.restoreState(memento);
		}
	}
}