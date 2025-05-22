package techcrashcourse.mediator;

import java.util.List;
import java.util.ArrayList;

public class ChatServerMediator implements ChatServer {
	private List<Participant> participantList;

	public ChatServerMediator() {
		participantList = new ArrayList<Participant>();
	}

	public void addUser(Participant user) {
		participantList.add(user);
	}

	public void sendMessage(Participant user, String message) {
		for (Participant p : participantList) {
			if (p != user) {
				p.receiveMessage(message, user);
			}
		}
	}
}
