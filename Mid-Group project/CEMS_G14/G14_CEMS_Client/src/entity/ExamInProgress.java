package entity;

import java.io.Serializable;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import javafx.application.Platform;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Alert.AlertType;

public class ExamInProgress implements Serializable {

	private static final long serialVersionUID = 1L;
	private String examID;
	private int progressId;
	private String type;
	private String subject;
	private String course;
	private int time;
	private String code;
	private int extraTime;
	private String status;
	private String operatorLecturer;
	private String date;
	
	private Button lockExam;
	private Button requestExtraTimeButton;
	
	public ExamInProgress(String examID, int progressId, String subject, String course, String type, int time, String code, int extraTime,
			String status, String operatorLecturer, String date) {
		super();
		this.examID = examID;
		this.progressId = progressId;
		this.subject = subject;
		this.course = course;
		this.type = type;
		this.time = time;
		this.code = code;
		this.extraTime = extraTime;
		this.status = status;
		this.operatorLecturer = operatorLecturer;
		this.date = date;
	}
	
	
	
	public Button getRequestExtraTimeButton() {
		return requestExtraTimeButton;
	}



	public void setRequestExtraTimeButton(Button requestExtraTimeButton) {
		this.requestExtraTimeButton = requestExtraTimeButton;
	}



	public Button getLockExam() {
		return lockExam;
	}

	public void setLockExam(Button lockExam) {
		this.lockExam = lockExam;
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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getExtraTime() {
		return extraTime;
	}

	public void setExtraTime(int extraTime) {
		this.extraTime = extraTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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
