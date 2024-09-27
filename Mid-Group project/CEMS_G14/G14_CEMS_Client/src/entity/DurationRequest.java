
package entity;

import java.io.Serializable;

public class DurationRequest implements Serializable{
	
	
	/**
	 * 
	 */
	private int RequestID;
	private int ExamID;
	private int LectureID;
	private String LectureName;
	private int Pre_duration;
	private int Re_duration;
	private String Topic;
	private String Course;
	private String Reason;
	private String status;

	 
	
	public DurationRequest(int RequestID,int ExamID,int LectureID, String LectureName,int Pre_duration,int Re_duration,String Topic,String Course,String Reason,String status) {
		this.RequestID=RequestID;
		this.ExamID=ExamID;
		this.LectureID =LectureID;
		this.LectureName=LectureName;
		this.Pre_duration =Pre_duration;
		this.Re_duration =Re_duration;
		this.Topic=Topic;
		this.Course=Course;
		this.Reason=Reason;
		this.status=status;

	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	public int getRequestID() {
		return RequestID;
	}



	public void setRequestID(int requestID) {
		RequestID = requestID;
	}



	public int getExamID() {
		return ExamID;
	}



	public void setExamID(int examID) {
		ExamID = examID;
	}



	public int getLectureID() {
		return LectureID;
	}



	public void setLectureID(int lectureID) {
		LectureID = lectureID;
	}



	public String getLectureName() {
		return LectureName;
	}



	public void setLectureName(String lectureName) {
		LectureName = lectureName;
	}



	public int getPre_duration() {
		return Pre_duration;
	}



	public void setPre_duration(int pre_duration) {
		Pre_duration = pre_duration;
	}



	public int getRe_duration() {
		return Re_duration;
	}



	public void setRe_duration(int re_duration) {
		Re_duration = re_duration;
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



	public String getReason() {
		return Reason;
	}



	public void setReason(String reason) {
		Reason = reason;
	}



	@Override
	public String toString() {
		return "DurationRequest [RequestID=" + RequestID + ", ExamID=" + ExamID + ", LectureID=" + LectureID
				+ ", LectureName=" + LectureName + ", Pre_duration=" + Pre_duration + ", Re_duration=" + Re_duration
				+ ", Topic=" + Topic + ", Course=" + Course + ", Reason=" + Reason + ", status=" + status + "]";
	}



	
	
}

