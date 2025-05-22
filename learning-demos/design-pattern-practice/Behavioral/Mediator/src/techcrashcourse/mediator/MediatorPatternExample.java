package techcrashcourse.mediator;

public class MediatorPatternExample {
	public static void main(String args[]) {
		ChatServer chatServer = new ChatServerMediator();

		Participant jack = new Participant("Jack");
		Participant george = new Participant("George");
		Participant emilly = new Participant("Emilly");

		jack.joinChatGroup(chatServer);
		george.joinChatGroup(chatServer);
		emilly.joinChatGroup(chatServer);

		// Jack is sending message
		jack.sendMessage("Hi Everyone, I am Jack");
		// Emilly replying to Jack
		emilly.sendMessage("Hi Jack, How are you");
	}
}