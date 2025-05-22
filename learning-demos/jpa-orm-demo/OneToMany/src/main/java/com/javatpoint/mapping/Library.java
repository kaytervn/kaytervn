package com.javatpoint.mapping;

import javax.persistence.*;

@Entity
public class Library {
	@Id
	private int b_id;
	private String b_name;

	public Library(int b_id, String b_name) {
		super();
		this.b_id = b_id;
		this.b_name = b_name;

	}

	public Library() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getB_id() {
		return b_id;
	}

	public void setB_id(int b_id) {
		this.b_id = b_id;
	}

	public String getB_name() {
		return b_name;
	}

	public void setB_name(String b_name) {
		this.b_name = b_name;
	}

}