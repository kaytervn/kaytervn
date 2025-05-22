package sample.command;

public class PlayCommand implements Command {
	private MusicPlayer musicPlayer;

	public PlayCommand(MusicPlayer musicPlayer) {
		this.musicPlayer = musicPlayer;
	}

	@Override
	public void execute() {
		musicPlayer.play();
	}

	@Override
	public void undo() {
		musicPlayer.stop();
	}
}