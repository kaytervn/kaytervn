package com.gpcoder.patterns.creational.dependencyinjection.message.simple;

public class UserController {

	private EmailService emailService = new EmailService();

	public void send() {
		emailService.sendEmail("Hello Dependency injection pattern");
	}
}