package sample.memento;

import java.util.ArrayList;
import java.util.List;

public class Caretaker {
	private final List<TextEditorMemento> mementos = new ArrayList<>();

	public void save(TextEditor editor) {
		mementos.add(editor.save());
	}

	public void undo(TextEditor editor) {
		if (!mementos.isEmpty()) {
			TextEditorMemento memento = mementos.remove(mementos.size() - 1);
			editor.restore(memento);
		}
	}
}