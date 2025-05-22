package techcrashcourse.mediator;

public interface ChatServer {
	public void addUser(Participant user);

	public void sendMessage(Participant user, String message);
}
