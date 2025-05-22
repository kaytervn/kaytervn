package com.gpcoder.patterns.structural.bridge;

public abstract class Bank {

	protected Account account;

	public Bank(Account account) {
		this.account = account;
	}

	public abstract void openAccount();
}