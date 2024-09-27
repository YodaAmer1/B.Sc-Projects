package entity;

import java.io.Serializable;

public class StudentExamGrade implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String studentID;
	private int grade;
	
	public StudentExamGrade(String studentID, int grade) {
		super();
		this.studentID = studentID;
		this.grade = grade;
	}
	
	public String getStudentID() {
		return studentID;
	}
	public void setStudentID(String studentID) {
		this.studentID = studentID;
	}
	public int getGrade() {
		return grade;
	}
	public void setGrade(int grade) {
		this.grade = grade;
	}
	
	
}
