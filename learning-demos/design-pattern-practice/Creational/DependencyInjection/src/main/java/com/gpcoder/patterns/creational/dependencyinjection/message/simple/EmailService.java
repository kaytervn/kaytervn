package com.gpcoder.patterns.creational.dependencyinjection.message.simple;

public class EmailService {

	public void sendEmail(String message) {
		System.out.println("Message: " + message);
	}
}