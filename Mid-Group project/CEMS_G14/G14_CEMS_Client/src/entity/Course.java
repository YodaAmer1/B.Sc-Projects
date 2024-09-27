package entity;

import java.io.Serializable;

import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;

public class Course implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String courseID;
	private String course;
	private String subjectID;


	public Course(String courseID, String course, String subjectID) {
		super();
		this.courseID = courseID;
		this.course = course;
		this.subjectID = subjectID;
	}

	public String getCourseID() {
		return courseID;
	}

	public void setCourseID(String courseID) {
		this.courseID = courseID;
	}

	public String getCourse() {
		return course;
	}

	public void setCourse(String course) {
		this.course = course;
	}
	public String getSubjectID() {
		return subjectID;
	}

	public void setSubjectID(String subjectID) {
		this.subjectID = subjectID;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return courseID + " - " + course;
	}
	
	
}
