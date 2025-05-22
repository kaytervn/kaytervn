package sample.command;

public class Client {
	public static void main(String[] args) {
		MusicPlayer musicPlayer = new MusicPlayer();
		RemoteControl remoteControl = new RemoteControl();

		Command playCommand = new PlayCommand(musicPlayer);
		remoteControl.executeCommand(playCommand);

		Command pauseCommand = new PauseCommand(musicPlayer);
		remoteControl.executeCommand(pauseCommand);

		remoteControl.undoCommand();

		remoteControl.undoCommand();
	}
}