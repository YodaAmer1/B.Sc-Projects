package entity;

import java.io.Serializable;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import javafx.application.Platform;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Alert.AlertType;

public class ExamDone implements Serializable {

	private static final long serialVersionUID = 1L;
	private String examID;
	private int progressId;
	private String type;
	private String subject;
	private String course;
	private int time;
	private int extraTime;
	private String operatorLecturer;
	private String date;
	private int numberOfStudents;

	private Button viewReportButton;
	
	public ExamDone(String examID, int progressId, String subject, String course, String type, int time, int extraTime, String operatorLecturer, String date, int numberOfStudents) {
		super();
		this.examID = examID;
		this.progressId = progressId;
		this.subject = subject;
		this.course = course;
		this.type = type;
		this.time = time;
		this.extraTime = extraTime;
		this.operatorLecturer = operatorLecturer;
		this.date = date;
		this.numberOfStudents = numberOfStudents;
	}
	
	

	public int getNumberOfStudents() {
		return numberOfStudents;
	}



	public void setNumberOfStudents(int numberOfStudents) {
		this.numberOfStudents = numberOfStudents;
	}



	public Button getViewReportButton() {
		return viewReportButton;
	}

	public void setViewReportButton(Button viewReportButton) {
		this.viewReportButton = viewReportButton;
	}

	public String getExamID() {
		return examID;
	}

	public void setExamID(String examID) {
		this.examID = examID;
	}



	public String getSubject() {
		return subject;
	}



	public void setSubject(String subject) {
		this.subject = subject;
	}



	public String getCourse() {
		return course;
	}



	public void setCourse(String course) {
		this.course = course;
	}



	public int getProgressId() {
		return progressId;
	}

	public void setProgressId(int progressId) {
		this.progressId = progressId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public int getExtraTime() {
		return extraTime;
	}

	public void setExtraTime(int extraTime) {
		this.extraTime = extraTime;
	}

	public String getOperatorLecturer() {
		return operatorLecturer;
	}

	public void setOperatorLecturer(String operatorLecturer) {
		this.operatorLecturer = operatorLecturer;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

}
