package entity;

import java.io.Serializable;

import javafx.scene.control.Button;

public class ExamReport {
	
	private String examID;
	private String course;
	private String date;
	private Button btnViewReport;
	
	public ExamReport(String examID, String course, String date, Button btnViewReport) {
		this.examID = examID;
		this.course = course;
		this.date = date;
		this.btnViewReport = btnViewReport;
	}

	public String getId() {
		return examID;
	}
	public void setId(String examID) {
		this.examID = examID;
	}
	public String getCourse() {
		return course;
	}
	public void setCourse(String course) {
		this.course = course;
	}
	public String getExamDate() {
		return date;
	}
	public void setExamDate(String date) {
		this.date = date;
	}
	public Button getButton() {
		return btnViewReport;
	}
	public void setButton(Button btnViewReport) {
		this.btnViewReport = btnViewReport;
	}

	@Override
	public String toString() {
		return "Exam: [ID: " + examID + ", course: " + course + ", date: " + date + "]";
	}
	

	
}
