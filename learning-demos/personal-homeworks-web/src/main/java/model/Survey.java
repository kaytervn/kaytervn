package model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Survey implements Serializable {
	private String firstName;
	private String lastName;
	private String email;
	private String date;
	private String heardFrom;
	private String updateOK;
	private String emailOK;
	private String contactVia;

	public Survey() {
		firstName = "";
		lastName = "";
		email = "";
		date = "";
		heardFrom = "";
		updateOK = "";
		emailOK = "";
		contactVia = "";
	}

	public Survey(String firstName, String lastName, String email, String date, String heardFrom, String updateOK,
			String emailOK, String contactVia) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.date = date;
		this.heardFrom = heardFrom;
		this.updateOK = updateOK;
		this.emailOK = emailOK;
		this.contactVia = contactVia;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getHeardFrom() {
		return heardFrom;
	}

	public void setHeardFrom(String heardFrom) {
		this.heardFrom = heardFrom;
	}

	public String getUpdateOK() {
		return updateOK;
	}

	public void setUpdateOK(String updateOK) {
		this.updateOK = updateOK;
	}

	public String getEmailOK() {
		return emailOK;
	}

	public void setEmailOK(String emailOK) {
		this.emailOK = emailOK;
	}

	public String getContactVia() {
		return contactVia;
	}

	public void setContactVia(String contactVia) {
		this.contactVia = contactVia;
	}
}
