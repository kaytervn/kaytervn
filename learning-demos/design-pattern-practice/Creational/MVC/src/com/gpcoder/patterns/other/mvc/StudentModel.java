package com.gpcoder.patterns.other.mvc;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentModel {

	private Integer id;
	private String name;
	private LocalDate updatedDate;

	public StudentModel(Integer id, String name, LocalDate updatedDate) {
		super();
		this.id = id;
		this.name = name;
		this.updatedDate = updatedDate;
	}

	public boolean save() {
		if (name.length() <= 10) {
			this.updatedDate = LocalDate.now();
			return true;
		}
		return false;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public LocalDate getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(LocalDate updatedDate) {
		this.updatedDate = updatedDate;
	}

}