package techcrashcourse.mediator;

public class Participant {
	private String userName;
	private ChatServer charServerMediator;

	public Participant(String name) {
		this.userName = name;
	}

	public String getUserName() {
		return userName;
	}

	public void joinChatGroup(ChatServer chatGroup) {
		charServerMediator = chatGroup;
		charServerMediator.addUser(this);
	}

	public void sendMessage(String message) {
		System.out.println(userName + ", Sending this message : \"" + message + "\"");
		charServerMediator.sendMessage(this, message);
	}

	public void receiveMessage(String message, Participant user) {
		System.out.println(userName + ", Received : \"" + message + "\", From : " + user.userName);
	}
}
