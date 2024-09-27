package entity;

import java.io.Serializable;
import java.util.ArrayList;

import javafx.scene.control.Button;

public class Exam implements Serializable {

	private static final long serialVersionUID = 1L;
	private String examID;
	private String subjectID;
	private String subject;
	private String courseID;
	private String course;
	private String time;
	private int numOfQuestions;
	private String lecturerID;
	private String lecturerName;
	private String commentsForLecturer;
	private String commentsForStudents;
	
	private ArrayList<QuestionForExam> questions;
	
	public Exam(String examID, String subjectID, String subject, String courseID, String course, String time, int numOfQuestions, String lecturerID,
			String lecturerName, String commentsForLecturer, String commentsForStudents) {
		super();
		this.examID = examID;
		this.subjectID = subjectID;
		this.subject = subject;
		this.courseID = courseID;
		this.course = course;
		this.time = time;
		this.numOfQuestions = numOfQuestions;
		this.lecturerID = lecturerID;
		this.lecturerName = lecturerName;
		this.commentsForLecturer = commentsForLecturer;
		this.commentsForStudents = commentsForStudents;
	}

	
	
	public void setSubjectID(String subjectID) {
		this.subjectID = subjectID;
	}

	public void setCourseID(String courseID) {
		this.courseID = courseID;
	}

	public String getSubjectID() {
		return subjectID;
	}

	public String getCourseID() {
		return courseID;
	}

	public ArrayList<QuestionForExam> getQuestions() {
		return questions;
	}

	public void setQuestions(ArrayList<QuestionForExam> questions) {
		this.questions = questions;
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

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public int getNumOfQuestions() {
		return numOfQuestions;
	}

	public void setNumOfQuestions(int numOfQuestions) {
		this.numOfQuestions = numOfQuestions;
	}

	public String getLecturerID() {
		return lecturerID;
	}

	public void setLecturerID(String lecturerID) {
		this.lecturerID = lecturerID;
	}

	public String getLecturerName() {
		return lecturerName;
	}

	public void setLecturerName(String lecturerName) {
		this.lecturerName = lecturerName;
	}

	public String getCommentsForLecturer() {
		return commentsForLecturer;
	}

	public void setCommentsForLecturer(String commentsForLecturer) {
		this.commentsForLecturer = commentsForLecturer;
	}

	public String getCommentsForStudents() {
		return commentsForStudents;
	}

	public void setCommentsForStudents(String commentsForStudents) {
		this.commentsForStudents = commentsForStudents;
	}

	@Override
	public String toString() {
		return "Exam [examID=" + examID + ", subject=" + subject + ", course=" + course + ", time=" + time
				+ ", numOfQuestions=" + numOfQuestions + ", lecturerID=" + lecturerID + ", lecturerName=" + lecturerName
				+ ", commentsForLecturer=" + commentsForLecturer + ", commentsForStudents=" + commentsForStudents + "]";
	}
	
	
}
