package entity;

import java.io.Serializable;
import java.util.ArrayList;

public class StudentSubmitedExam implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String studentID;
	private int progressId;
	private String examID;
	private String subject;
	private String course;
	private String duration;
	private String startTime;
	private String endTime;
	private int examGrade;
	
	private ArrayList<StudentQuestionAnswer> answers;

	public StudentSubmitedExam(String studentID,int progressId , String examID, String subject, String course, String duration, String startTime, String endTime,
			int examGrade, ArrayList<StudentQuestionAnswer> answers) {
		super();
		this.studentID = studentID;
		this.progressId = progressId;
		this.examID = examID;
		this.subject = subject;
		this.course = course;
		this.duration = duration;
		this.startTime = startTime;
		this.endTime = endTime;
		this.examGrade = examGrade;
		this.answers = answers;
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


	public String getStudentID() {
		return studentID;
	}

	public void setStudentID(String studentID) {
		this.studentID = studentID;
	}

	public String getExamID() {
		return examID;
	}

	public void setExamID(String examID) {
		this.examID = examID;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
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

	public int getExamGrade() {
		return examGrade;
	}

	public void setExamGrade(int examGrade) {
		this.examGrade = examGrade;
	}

	public ArrayList<StudentQuestionAnswer> getAnswers() {
		return answers;
	}

	public void setAnswers(ArrayList<StudentQuestionAnswer> answers) {
		this.answers = answers;
	}
	
	 
}
