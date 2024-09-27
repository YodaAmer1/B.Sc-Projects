package entity;

import java.io.Serializable;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import javafx.application.Platform;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Alert.AlertType;

public class ExtraTimeRequest implements Serializable {

	private static final long serialVersionUID = 1L;
	private int requestID;
	private int progressId;
	private String requesterID;
	private String requesterName;
	private String course;
	private int time;
	private String subject;
	private int extraTime;
	private String reason;
	private String status;
	
	public ExtraTimeRequest(int requestID, int progressId, String requesterID, String requesterName, String course,
			int time, String subject, int extraTime, String reason, String status) {
		super();
		this.requestID = requestID;
		this.progressId = progressId;
		this.requesterID = requesterID;
		this.requesterName = requesterName;
		this.course = course;
		this.time = time;
		this.subject = subject;
		this.extraTime = extraTime;
		this.reason = reason;
		this.status = status;
	}

	public int getRequestID() {
		return requestID;
	}

	public void setRequestID(int requestID) {
		this.requestID = requestID;
	}

	public int getProgressId() {
		return progressId;
	}

	public void setProgressId(int progressId) {
		this.progressId = progressId;
	}

	public String getRequesterID() {
		return requesterID;
	}

	public void setRequesterID(String requesterID) {
		this.requesterID = requesterID;
	}

	public String getRequesterName() {
		return requesterName;
	}

	public void setRequesterName(String requesterName) {
		this.requesterName = requesterName;
	}

	public String getCourse() {
		return course;
	}

	public void setCourse(String course) {
		this.course = course;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public int getExtraTime() {
		return extraTime;
	}

	public void setExtraTime(int extraTime) {
		this.extraTime = extraTime;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
