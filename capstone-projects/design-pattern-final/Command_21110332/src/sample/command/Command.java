package sample.command;

public interface Command {
	void execute();

	void undo();
}