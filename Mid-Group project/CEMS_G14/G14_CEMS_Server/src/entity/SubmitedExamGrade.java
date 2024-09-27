package entity;

import java.io.Serializable;

public class SubmitedExamGrade implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String studentID;
	private int progressID;
	private String examID;
	private int grade;
	private String comments;
	
	public SubmitedExamGrade(String studentID, int progressID, String examID, int grade, String comments) {
		super();
		this.studentID = studentID;
		this.progressID = progressID;
		this.examID = examID;
		this.grade = grade;
		this.comments = comments;
	}

	public String getStudentID() {
		return studentID;
	}

	public void setStudentID(String studentID) {
		this.studentID = studentID;
	}

	public int getProgressID() {
		return progressID;
	}

	public void setProgressID(int progressID) {
		this.progressID = progressID;
	}

	public String getExamID() {
		return examID;
	}

	public void setExamID(String examID) {
		this.examID = examID;
	}

	public int getGrade() {
		return grade;
	}

	public void setGrade(int grade) {
		this.grade = grade;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}
	
	@Override
	public String toString() {
		return "SubmitedExamGrade [studentID=" + studentID + ", progressID=" + progressID + ", examID=" + examID
				+ ", grade=" + grade + ", comments=" + comments + "]";
	}
}
