package personal.command;

public class CommandPatternExample {
	public static void main(String[] args) {
		TV tv = new TV();
		RemoteControl remote = new RemoteControl();

		Command turnOnCommand = new TurnOnCommand(tv);
		remote.setCommand(turnOnCommand);
		remote.pressButton();

		Command turnOffCommand = new TurnOffCommand(tv);
		remote.setCommand(turnOffCommand);
		remote.pressButton();
	}
}