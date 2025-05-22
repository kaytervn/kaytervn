package sample.memento;

public class TextEditor {
	private String text;

	public TextEditor() {
		this.text = "";
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public TextEditorMemento save() {
		return new TextEditorMemento(text);
	}

	public void restore(TextEditorMemento memento) {
		text = memento.getState();
	}
}