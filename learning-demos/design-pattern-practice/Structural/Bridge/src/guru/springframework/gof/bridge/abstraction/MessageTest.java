package guru.springframework.gof.bridge.abstraction;

import guru.springframework.gof.bridge.implementation.EmailMessageSender;
import guru.springframework.gof.bridge.implementation.MessageSender;
import guru.springframework.gof.bridge.implementation.TextMessageSender;

public class MessageTest {
	public static void main(String[] args) {
		MessageSender textMessageSender = new TextMessageSender();
		Message textMessage = new TextMessage(textMessageSender);
		textMessage.send();
		MessageSender emailMessageSender = new EmailMessageSender();
		Message emailMessage = new TextMessage(emailMessageSender);
		emailMessage.send();
	}
}