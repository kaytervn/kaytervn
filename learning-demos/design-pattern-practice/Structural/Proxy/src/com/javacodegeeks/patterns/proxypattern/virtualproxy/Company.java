package com.javacodegeeks.patterns.proxypattern.virtualproxy;

public class Company {

	private String companyName;
	private String companyAddress;
	private String companyContactNo;
	private ContactList contactList;

	public Company(String companyName, String companyAddress, String companyContactNo, ContactList contactList) {
		this.companyName = companyName;
		this.companyAddress = companyAddress;
		this.companyContactNo = companyContactNo;
		this.contactList = contactList;

		System.out.println("Company object created...");
	}

	public String getCompanyName() {
		return companyName;
	}

	public String getCompanyAddress() {
		return companyAddress;
	}

	public String getCompanyContactNo() {
		return companyContactNo;
	}

	public ContactList getContactList() {
		return contactList;
	}

}