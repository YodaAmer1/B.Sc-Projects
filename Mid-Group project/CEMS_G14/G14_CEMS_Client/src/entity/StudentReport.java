package entity;

import java.io.Serializable;

import javafx.scene.control.Button;

public class StudentReport implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String ExamId;
	private String LectureName;
	private String Time;
	private String date;
	private String examType;
	private String course;
	private String comments;
	private String grade;
	private String subject;
	


	public StudentReport(String ExamId, String LectureName, String Time,String date,String examType,String course,String comments,String grade,String subject) {
		this.ExamId=ExamId;
		this.LectureName=LectureName;
		this.Time=Time;
		this.date=date;
		this.examType=examType;
		this.course=course;
		this.comments=comments;
		this.grade=grade;
		this.subject=subject;

	}


	

	public String getExamId() {
		return ExamId;
	}


	public void setExamId(String examId) {
		ExamId = examId;
	}


	public String getLectureName() {
		return LectureName;
	}


	public void setLectureName(String lectureName) {
		LectureName = lectureName;
	}


	public String getTime() {
		return Time;
	}


	public void setTime(String time) {
		Time = time;
	}


	public String getDate() {
		return date;
	}


	public void setDate(String date) {
		this.date = date;
	}


	public String getExamType() {
		return examType;
	}


	public void setExamType(String examType) {
		this.examType = examType;
	}


	public String getCourse() {
		return course;
	}


	public void setCourse(String course) {
		this.course = course;
	}


	public String getComments() {
		return comments;
	}


	public void setComments(String comments) {
		this.comments = comments;
	}


	public String getGrade() {
		return grade;
	}


	public void setGrade(String grade) {
		this.grade = grade;
	}


	public String getSubject() {
		return subject;
	}


	public void setSubject(String subject) {
		this.subject = subject;
	}


	@Override
	public String toString() {
		return "StudentReport [ "+" ExamId=" + ExamId + ", LectureName=" + LectureName
				+ ", Time=" + Time + ", date=" + date + ", examType=" + examType + ", course=" + course + ", comments="
				+ comments + ", grade=" + grade + ", subject=" + subject + "]";
	}
	
	
	
}
