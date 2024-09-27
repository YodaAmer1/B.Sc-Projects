package entity;

import java.io.Serializable;

public class StudentStartExam implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String studentID;
	private String examCode;
	
	public StudentStartExam(String studentID, String examCode) {
		super();
		this.studentID = studentID;
		this.examCode = examCode;
	}
	public String getStudentID() {
		return studentID;
	}
	public void setStudentID(String studentID) {
		this.studentID = studentID;
	}
	public String getExamCode() {
		return examCode;
	}
	public void setExamCode(String examCode) {
		this.examCode = examCode;
	}
	

}
