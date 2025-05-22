package model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

	public enum Gender {
		MALE, FEMALE, UNKNOWN
	}

	public enum Role {
		USER, ADMIN
	}

	public enum Status {
		INACTIVE, ACTIVE
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int id;
	@Column(name = "name")
	private String name;
	@Column(name = "role")
	private Role role;
	@Column(name = "password")
	private String password;
	@Column(name = "birthdate")
	private String birthdate;
	@Column(name = "status")
	private Status status;
	@Column(name = "gender")
	private Gender gender;
	@Column(name = "email")
	private String email;
	@Column(name = "phoneNumber")
	private String phoneNumber;
	@Column(name = "code")
	private String code;
	@Column(name = "image", columnDefinition = "TEXT")
	private String image;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public User() {

	}

	public User(String name, String email, String code) {
		super();
		this.name = name;
		this.email = email;
		this.code = code;
	}

	public User(String name, Role role, Gender gender, String email, String password, String code, Status status) {
		super();
		this.name = name;
		this.role = role;
		this.status = status;
		this.email = email;
		this.password = password;
		this.code = code;
		this.gender = gender;
	}

	public User(String name, Role role, String password, String birthdate, Status status, Gender gender, String email,
			String phoneNumber, String code, String image) {
		super();
		this.name = name;
		this.role = role;
		this.password = password;
		this.birthdate = birthdate;
		this.status = status;
		this.gender = gender;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.code = code;
		this.image = image;
	}
}