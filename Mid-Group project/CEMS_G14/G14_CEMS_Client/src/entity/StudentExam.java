package entity;

import java.io.Serializable;

import javafx.scene.control.Button;

public class StudentExam implements Serializable {

	private static final long serialVersionUID = 1L;
	private String studentID;
	private int progressID;
	private String examID;
	private String subject;
	private String course;
	private String startTime;
	private String endTime;
	private String duration;
	private String grade;
	private String lecturerComments;
	private String status;
	
	/**
	 * array byte of the manual exam to upload.
	 */
	private byte[] arrByteManualExamUpload;
	
	public StudentExam(String examID, String subject, String course, String startTime, String endTime, String duration,
			String grade, String lecturerComments, String status) {
		super();
		this.examID = examID;
		this.subject = subject;
		this.course = course;
		this.startTime = startTime;
		this.endTime = endTime;
		this.duration = duration;
		this.grade = grade;
		this.lecturerComments = lecturerComments;
		this.status = status;
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

	public StudentExam() {
		
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

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getLecturerComments() {
		return lecturerComments;
	}

	public void setLecturerComments(String lecturerComments) {
		this.lecturerComments = lecturerComments;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public byte[] getArrByteManualTestUpload() {
		return arrByteManualExamUpload;
	}

	public void setArrByteManualTestUpload(byte[] arrByteManualTestUpload) {
		this.arrByteManualExamUpload = arrByteManualTestUpload;
	}
	
	
}
