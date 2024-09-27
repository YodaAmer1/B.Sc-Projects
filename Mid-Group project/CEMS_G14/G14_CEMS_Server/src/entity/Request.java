
package entity;

import java.io.Serializable;

import javafx.scene.control.Button;

public class Request implements Serializable{
	
	
	/**
	 * 
	 */
	private int RequestID;
	private String LectureName;
	private int ExamID;
	private String Course;
	private String Topic;
	private Button btnViewRequest;
	
	public Request(int RequestID, String LectureName, int ExamID,String Course,String Topic) {
		this.RequestID=RequestID;
		this.LectureName=LectureName;
		this.ExamID=ExamID;
		this.Course=Course;
		this.Topic=Topic;
		
	}

	public int getRequestID() {
		return RequestID;
	}

	public void setRequestID(int requestID) {
		RequestID = requestID;
	}

	public String getLectureName() {
		return LectureName;
	}

	public void setLectureName(String lectureName) {
		LectureName = lectureName;
	}

	public int getExamID() {
		return ExamID;
	}

	public void setExamID(int examID) {
		ExamID = examID;
	}

	public String getTopic() {
		return Topic;
	}

	public void setTopic(String topic) {
		Topic = topic;
	}

	public String getCourse() {
		return Course;
	}

	public void setCourse(String course) {
		Course = course;
	}

	public Button getBtnViewRequest() {
		return btnViewRequest;
	}

	public void setBtnViewRequest(Button btnViewRequest) {
		this.btnViewRequest = btnViewRequest;
	}

	@Override
	public String toString() {
		return "DurationRequest [RequestID=" + RequestID + ", LectureName=" + LectureName + ", ExamID=" + ExamID
				+ ", Course=" + Course + ", Topic=" + Topic + "]";
	}

		

	
}
