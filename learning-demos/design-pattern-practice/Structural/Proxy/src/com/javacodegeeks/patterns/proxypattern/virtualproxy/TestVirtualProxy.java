package com.javacodegeeks.patterns.proxypattern.virtualproxy;

import java.util.List;

public class TestVirtualProxy {

	public static void main(String[] args) {
		ContactList contactList = new ContactListProxyImpl();
		Company company = new Company("ABC Company", "India", "+91-011-28458965", contactList);

		System.out.println("Company Name: " + company.getCompanyName());
		System.out.println("Company Address: " + company.getCompanyAddress());
		System.out.println("Company Contact No.: " + company.getCompanyContactNo());

		System.out.println("Requesting for contact list");

		contactList = company.getContactList();

		List<Employee> empList = contactList.getEmployeeList();
		for (Employee emp : empList) {
			System.out.println(emp);
		}
	}

}