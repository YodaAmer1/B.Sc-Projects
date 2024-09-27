package entity;

import java.io.Serializable;

public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	private String id;
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private int role;
	private String faculty;
	private int isLogedIn;

	public User(String username, String password) {
		this.username = username;
		this.password = password;
	}
	
	public User(String username, String password, int role, String firstName, String lastName, String faculty, String id, int isLogedIn) {
		this.username = username;
		this.password = password;
		this.role = role;
		this.firstName = firstName;
		this.lastName = lastName;
		this.faculty = faculty;
		this.id = id;
		this.isLogedIn = isLogedIn;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public String getFaculty() {
		return faculty;
	}

	public void setFaculty(String faculty) {
		this.faculty = faculty;
	}

	public int getIsLogedIn() {
		return isLogedIn;
	}

	public void setIsLogedIn(int isLogedIn) {
		this.isLogedIn = isLogedIn;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", password=" + password + ", firstName=" + firstName
				+ ", lastName=" + lastName + ", role=" + role + ", faculty=" + faculty + ", isLogedIn=" + isLogedIn
				+ "]";
	}
	
}
