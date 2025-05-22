package com.javacodegeeks.patterns.proxypattern.virtualproxy;

import java.util.List;

public class ContactListProxyImpl implements ContactList {

	private ContactList contactList;

	@Override
	public List<Employee> getEmployeeList() {
		if (contactList == null) {
			System.out.println("Creating contact list and fetching list of employees...");
			contactList = new ContactListImpl();
		}
		return contactList.getEmployeeList();
	}

}