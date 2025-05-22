package sample.command;

public class RemoteControl {
	private Command command;

	public void executeCommand(Command command) {
		this.command = command;
		command.execute();
	}

	public void undoCommand() {
		if (command != null) {
			command.undo();
		}
	}
}