package com.gpcoder.patterns.creational.dependencyinjection.message.di;

public class DependencyInjectionPatternExample {

	public static void main(String[] args) {
		MessageService messageService = new EmailService();
		UserController userController = new UserController(messageService);
		userController.send();
	}
}