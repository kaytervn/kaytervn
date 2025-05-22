package sample.memento;

public class EditorClient {
	public static void main(String[] args) {
		TextEditor editor = new TextEditor();
		Caretaker caretaker = new Caretaker();

		editor.setText("This is the initial text.");
		caretaker.save(editor);

		editor.setText("This is the modified text.");
		caretaker.save(editor);

		editor.setText("This is another modified text.");
		caretaker.save(editor);

		System.out.println("Current text: " + editor.getText());

		caretaker.undo(editor);
		System.out.println("Undoing: " + editor.getText());

		caretaker.undo(editor);
		System.out.println("Undoing again: " + editor.getText());
	}
}